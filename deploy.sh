#!/bin/bash

# Before using this script:
# (1) Update URLs in `serverless-workflow/src/main/resources/application.properties` if needed.
# (2) Export the following environment variables:
#    OPENSHIFT_TOKEN (Token to access your OpenShift instance)
#    OPENSHIFT_SERVER (Server associated with your OpenShift instance)
#    OPENSHIFT_NAMESPACE (Namespace or project where the deployments will be placed)
#    GITHUB_REPOSITORY (Source code of the services)

oc login --token=$OPENSHIFT_TOKEN --server=$OPENSHIFT_SERVER

APPS=("action-inferrer" "ansible" "monitoring-system" "ticket-manager" "waiting-room" "webapp" "serverless-workflow")

echo -e "\nCreating the deploy template..."
if oc get template/deploy-swf-demo-template >/dev/null 2>&1; then
  oc delete template/deploy-swf-demo-template
fi
oc create -f deploy-swf-demo-template.yaml
echo "Creating the template...done"

echo -e "\nDeleting old resources..."
for item in "${APPS[@]}"; do
  echo "- $item"
  oc delete all -l app=$item
done
echo "Deleting old resources...done"

echo -e "\nCreating new resources..."
oc process -f deploy-swf-demo-template.yaml -p OPENSHIFT_NAMESPACE=$OPENSHIFT_NAMESPACE -p GITHUB_REPOSITORY=$GITHUB_REPOSITORY | oc create -f -
echo "Creating new resources...done"

echo -e "\nResolving routes..."
action_inferrer_url=$(oc get kservice action-inferrer -o jsonpath='{.status.url}')
echo "action-inferrer: $action_inferrer_url"
ansible_url=$(oc get kservice ansible -o jsonpath='{.status.url}')
echo "ansible: $ansible_url"
monitoring_system_url=$(oc get kservice monitoring-system -o jsonpath='{.status.url}')
echo "monitoring-system: $monitoring_system_url"
ticket_manager_url=$(oc get kservice ticket-manager -o jsonpath='{.status.url}')
echo "ticket-manager: $ticket_manager_url"
waiting_room_url=$(oc get kservice waiting-room -o jsonpath='{.status.url}')
echo "waiting-room: $waiting_room_url"
webapp_url=$(oc get kservice webapp -o jsonpath='{.status.url}')
echo "webapp: $webapp_url"
serverless_workflow_url=$(oc get kservice serverless-workflow -o jsonpath='{.status.url}')
echo "serverless-workflow: $serverless_workflow_url"
echo "Resolving routes...done"

echo -e "\nStart building resources..."
oc start-build action-inferrer
oc start-build ansible
oc start-build monitoring-system
oc start-build ticket-manager
oc start-build waiting-room
oc start-build serverless-workflow \
  --env="ANSIBLE_SERVICE_URL=$ansible_url" \
  --env="TICKET_MANAGER_SERVICE_URL=$ticket_manager_url" \
  --env="ACTION_INFERRER_SERVICE_URL=$action_inferrer_url" \
  --env="WAITING_ROOM_SERVICE_URL=$waiting_room_url"
oc start-build webapp \
  --env="REACT_APP_ACTION_INFERRER_SERVICE_URL=$action_inferrer_url" \
  --env="REACT_APP_ANSIBLE_SERVICE_URL=$ansible_url" \
  --env="REACT_APP_MONITORING_SYSTEM_SERVICE_URL=$monitoring_system_url" \
  --env="REACT_APP_TICKET_MANAGER_SERVICE_URL=$ticket_manager_url" \
  --env="REACT_APP_WAITING_ROOM_SERVICE_URL=$waiting_room_url" \
  --env="REACT_APP_SERVERLESS_WORKFLOW_URL=$serverless_workflow_url"
echo "Start building resources...done"
