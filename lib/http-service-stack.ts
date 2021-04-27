import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as path from 'path';

export interface HttpServiceStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  cluster: ecs.Cluster;
  image?: ecs.ContainerImage;
}

export class HttpServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: HttpServiceStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 1024,
      cpu: 256,
    });

    const image = props.image || new ecs.AssetImage(path.join(__dirname, '..', 'demo-http-server'));
    const container = taskDefinition.addContainer("WebServer", {
      image,
    });
    container.addPortMappings({containerPort: 8000});

    const service = new ecs.FargateService(this, 'Service', {
      cluster: props.cluster,
      taskDefinition,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc: props.vpc,
      internetFacing: true,
    });

    const listener = lb.addListener('HttpListener', {
      port: 80,
    });

    listener.addTargets('DefaultTarget', {
      port: 8000,
      targets: [service]
    });

    // Cloudformation output
    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName});

  }

}
