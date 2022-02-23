import * as sst from "@serverless-stack/resources";
import * as apig from "@aws-cdk/aws-apigatewayv2-alpha";
import * as apigIntegrations from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export default class ApiStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const api = new sst.Api(this, "Api");

    const fn = new sst.Function(this, "Handler", {
      handler: "src/lambda.handler",
      currentVersionOptions:{
        provisionedConcurrentExecutions: 5,
      }
    });

    const integration = new apigIntegrations.HttpLambdaIntegration("Integration", fn.currentVersion, {
      payloadFormatVersion: apig.PayloadFormatVersion.VERSION_2_0
    });

    const route = new apig.HttpRoute(this, "someroute", {
      httpApi: api.httpApi,
      routeKey: apig.HttpRouteKey.with("/", apig.HttpMethod.GET),
      integration
    });

    this.addOutputs({
      API: api.url
    });
  }
}
