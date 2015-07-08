#!/bin/bash

# Post-install jvectormap
npm install
bower install
gulp
#
# if [ -d "jquery/dist" ]
# then
#     echo "The custom-built version of jQuery already exists."
# else
#   rm -R jquery && git clone git://github.com/jquery/jquery.git && cd jquery && npm install && grunt custom:-deprecated,-effects
# fi

#cd node_modules/jvectormap/ && sh build.sh

# *Insert other commands below*
