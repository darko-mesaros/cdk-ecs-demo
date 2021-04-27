import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';

export class ClusterStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly cluster: ecs.Cluster;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2});
    this.cluster = new ecs.Cluster(this, 'Cluster', {vpc: this.vpc});
    this.cluster.addCapacity('DefaultCapacity', {
      instanceType: new ec2.InstanceType('t4g.large'),
    });
  }
}
