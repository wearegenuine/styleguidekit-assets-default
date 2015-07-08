// Install npm
passthru("npm install");
// Install bower
passthru("bower install");

// Build assets
passthru("gulp");
