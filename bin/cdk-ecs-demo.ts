#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ClusterStack} from '../lib/cluster-stack';
import { HttpServiceStack } from '../lib/http-service-stack';

const app = new cdk.App();

const clusterStack = new ClusterStack(app, 'ClusterStack');

new HttpServiceStack(app, 'HttpServiceStack', {
  vpc: clusterStack.vpc,
  cluster: clusterStack.cluster,
});
