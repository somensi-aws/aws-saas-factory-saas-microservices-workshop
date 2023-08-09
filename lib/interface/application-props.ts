import * as cdk from "aws-cdk-lib";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { Tier } from "../enums/tier";
import { BaseStack } from "../base/base-stack";
import { ApplicationStack } from "../environment/application-stack";

export interface ApplicationStackProps extends cdk.StackProps {
  tier?: Tier;
  sideCarImageAsset?: DockerImageAsset;
  tenantId?: string;
  baseStack?: BaseStack;
  basicStack?: ApplicationStack;
  deploymentMode: string;
}
