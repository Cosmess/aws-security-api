import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Access } from '../repository/access.entity';
import { Group } from '../repository/group.entity';
import { Service } from '../repository/service.entity';
import { User } from '../repository/user.entity';
import { Permission } from '../repository/permission.entity';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv'

dotenv.config();
AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION
});

const ec2 = new AWS.EC2();

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private accessRepository: Repository<Access>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async revokeAndAddIngressRuleByDescription(ruleDescription: string, newIp: string, userId: number, typeGroup: string, typeService: string): Promise<Access> {
    const newIpCidr = `${newIp}/32`;
    const user = await this.userRepository.findOne({ where: { email: ruleDescription } });
    const group = await this.groupRepository.findOne({ where: { typeGroup } });
    const service = await this.serviceRepository.findOne({ where: { typeService } });

    if (!user || !group || !service) {
      throw new HttpException('Usuário, grupo ou serviço inválido', HttpStatus.FORBIDDEN);
    }

    const permission = await this.permissionRepository.findOne({ where: { user, group, service } });

    if (!permission) {
      throw new HttpException('Permissão negada', HttpStatus.FORBIDDEN);
    }

    const securityGroupId = group.securityGroupId;
    const protocol = 'tcp';
    const port = service.port;

    try {
      
      const data = await ec2.describeSecurityGroups({ GroupIds: [securityGroupId] }).promise();
      const securityGroup = data.SecurityGroups[0];

      const ruleToRevoke = securityGroup.IpPermissions.find((permission) =>
        permission.IpRanges.some((range) => range.Description === ruleDescription)
      );

      if (ruleToRevoke) {
        const paramsRevoke = {
          GroupId: securityGroupId,
          IpPermissions: [
            {
              IpProtocol: ruleToRevoke.IpProtocol,
              FromPort: ruleToRevoke.FromPort,
              ToPort: ruleToRevoke.ToPort,
              IpRanges: ruleToRevoke.IpRanges.filter((range) => range.Description === ruleDescription),
            },
          ],
        };

        await ec2.revokeSecurityGroupIngress(paramsRevoke).promise();
      }
      const paramsAuthorize = {
        GroupId: securityGroupId,
        IpPermissions: [
          {
            IpProtocol: protocol,
            FromPort: port,
            ToPort: port,
            IpRanges: [{ CidrIp: newIpCidr, Description: ruleDescription }],
          },
        ],
      };

      await ec2.authorizeSecurityGroupIngress(paramsAuthorize).promise();

      const access = this.accessRepository.create({ ruleDescription, newIp: newIpCidr, typeGroup, typeService });
      return this.accessRepository.save(access);
    } catch (error) {
      throw new Error(`Erro ao modificar as regras de entrada: ${error.message}`);
    }
  }
}
