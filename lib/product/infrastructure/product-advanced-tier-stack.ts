import { Construct } from "constructs";
import { ProductMicroserviceAdvancedTierStackProps } from "../../interface/product-microservice-advanced-tier-props";

export class ProductAdvancedTierStack extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: ProductMicroserviceAdvancedTierStackProps
  ) {
    super(scope, id);

    const cluster = props.cluster;
    const istioIngressGateway = props.istioIngressGateway;
    const productServiceDNS = props.productServiceDNS;
    const productServicePort = props.productServicePort;
    const tenantId = props.tenantId;
    const tier = props.tier;

    const productVirtualService = cluster.addManifest(
      "product-virtual-service",
      {
        apiVersion: "networking.istio.io/v1alpha3",
        kind: "VirtualService",
        metadata: {
          name: `pro-${tier}`,
          namespace: props?.namespace,
          labels: {
            tier: tier,
            ...(tenantId && {
              tenantId: tenantId,
            }),
          },
        },
        spec: {
          hosts: ["saas-workshop.example.com"],
          gateways: [istioIngressGateway],
          http: [
            {
              name: tenantId
                ? `${tenantId}-${tier}`.substring(0, 14)
                : `${tier}`.substring(0, 14),
              match: [
                {
                  uri: {
                    prefix: "/products",
                  },
                  headers: {
                    "@request.auth.claims.custom:tenant_tier": {
                      regex: tier,
                    },
                    "@request.auth.claims.custom:tenant_id": {
                      regex: tenantId,
                    },
                  },
                },
              ],
              route: [
                {
                  destination: {
                    host: productServiceDNS,
                    port: {
                      number: productServicePort,
                    },
                  },
                },
              ],
            },
          ],
        },
      }
    );
  }
}
