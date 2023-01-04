#!/bin/bash

# Before using this script:
# (1) Make sure there are no existing deployments for the services.
# (2) Update URLs in `src/main/resources/application.properties` if needed.
# (3) Replace all `caponetto-dev` occurrences with your namespace in the `resources.yaml` file.
# (4) Export the following environment variables:
# 	OPENSHIFT_TOKEN
# 	OPENSHIFT_SERVER

oc login --token=$OPENSHIFT_TOKEN --server=$OPENSHIFT_SERVER

oc apply -f resources.yaml

oc start-build action-inferrer
oc start-build ansible
oc start-build monitoring-system
oc start-build ticket-manager
oc start-build serverless-workflow
