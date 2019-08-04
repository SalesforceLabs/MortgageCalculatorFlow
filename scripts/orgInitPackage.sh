#!/bin/bash

sfdx force:org:create -a mclgtestInstall1 -f ../config/project-scratch-def.json

sfdx force:package:install -u mclgtestInstall1 -p 04t3i000001OTnH -w 5

sfdx force:org:open -u mclgtestInstall1

