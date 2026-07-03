-Deployments are control plane services

-Deployments help reconcile observed state with the desired state

-We can deploy a pod directly or we can wrap a pod in deployment

-Wrapping a Pod in deployment provides pod with the capabilities of self healing

-Deployments provide replica sets which help with rolling updates

-We can scale our pods manually, but K8s provides 3 types of autoscalers

-Horizontal pod autoscaler which increases or decreases pods based on the demand

-Vertical pod autoscaler which increases memory and is NOT widely used neither is there by default

-Cluster Autoscaler which increases or decreases cluster nodes to meet demand

-Most commonly used are the HPA and CA

-If the cluster node does not have enough space to manage any more pods, it keeps the remaining pod in pending state while CA provisions extra nodes
