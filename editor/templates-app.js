angular.module('templates-app', ['about/about.tpl.html', 'list/list.tpl.html']);

angular.module("about/about.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("about/about.tpl.html",
    "<div class=\"row\">\n" +
    "  This is your about page!\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("list/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list/list.tpl.html",
    "<div>\n" +
    "  <div class=\"topbar box-shadow\" ng-show=\"path\">\n" +
    "    <div>\n" +
    "      <table class=\"create-new\">\n" +
    "      <tr>\n" +
    "        <td class=\"vtop pull-left\">\n" +
    "          <div class=\"btn-group\" dropdown>\n" +
    "            <button type=\"button\" class=\"btn btn-success dropdown-toggle\" ng-disabled=\"disabled\" tooltip-placement=\"bottom\" tooltip=\"New...\"><i class=\"fa fa-2x fa-plus\"></i></button>\n" +
    "            <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "              <li><a href ng-click=\"openNewDir()\"><i class=\"fa fa-2x fa-folder-open-o fa-fw vmiddle\"></i> Directory</a></li>\n" +
    "              <li><a href ng-click=\"openNewFile()\"><i class=\"fa fa-2x fa-file-o fa-fw vmiddle\"></i> File</a></li>\n" +
    "              <li><a href ng-click=\"openNewUpload(path)\"><i class=\"fa fa-2x fa-cloud-upload fa-fw vmiddle\"></i> Upload</a></li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "        </td>\n" +
    "        <td class=\"vtop pull-left\">\n" +
    "          <button type=\"button\" class=\"btn btn-info\" tooltip-placement=\"bottom\" tooltip=\"Pick a different storage location\" ng-click=\"openNewLocation()\"><i class=\"fa fa-2x fa-database white\"></i></button>\n" +
    "        </td>\n" +
    "        <td class=\"pull-left\">\n" +
    "          <div id=\"crumbs\" class=\"collapse navbar-collapse\">\n" +
    "            <ul>\n" +
    "              <li ng-repeat=\"crumb in breadCrumbs\">\n" +
    "                <a href=\"{{crumb.uri}}\"><i class=\"fa white\" ng-class=\"$first?'fa-home':'fa-folder-open-o'\"></i><span class=\"white\"> {{crumb.name}}</span></a>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "        </td>\n" +
    "        <td class=\"pull-right vmiddle white\">\n" +
    "          <div tooltip-placement=\"bottom\" tooltip=\"{{userProfile.fullname}}\" class=\"avatar-frame\" ng-show=\"userProfile.webid\">\n" +
    "            <a href=\"{{userProfile.webid|toURL}}\" target=\"_blank\"><img ng-src=\"{{userProfile.picture}}\"></a>\n" +
    "          </div>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-md-12\" ng-hide=\"listLocation\">\n" +
    "    <div class=\"clear-70\"></div>\n" +
    "    <h1>Please provide a location for the LDP server:</h1>\n" +
    "    <div class=\"prepare-list\">\n" +
    "      <form name=\"preList\">\n" +
    "        <div class=\"btn-group half-width\">\n" +
    "          <input type=\"text\" ng-model=\"uriPath\" name=\"uriPath\" id=\"uriPath\" class=\"nginput pull-left\" placeholder=\"https://dredd.solid.community/public/\" autofocus />\n" +
    "          <button class=\"btn btn-primary\" ng-click=\"prepareList(uriPath)\"><i class=\"fa fa-search fa-2x\"></i></button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"index\" ng-show=\"listLocation\">\n" +
    "    <table class=\"box-shadow\">\n" +
    "      <thead>\n" +
    "          <th class=\"filename\">Name</th>\n" +
    "          <th>Size</th>\n" +
    "          <th>Modified</th>\n" +
    "          <th class=\"right\">More</th>\n" +
    "      </thead>\n" +
    "      <tr ng-show=\"emptyDir\">\n" +
    "        <td colspan=\"4\"><h2>Cannot list contents <span ng-show=\"noPerm\">(access denied)</span></h2></td>\n" +
    "      </tr>\n" +
    "      <tr ng-repeat=\"res in resources|orderBy:['type','name'] track by res.id\">\n" +
    "          <td colspan=\"{{res.type==='-'?3:1}}\">\n" +
    "            <a href=\"{{res.path}}\" target=\"{{res.type=='File'?'_blank':''}}\"><i class=\"fa fa-fw vmiddle\" ng-class=\"res.type=='Directory'||res.type==='-'?'fa-folder-open-o':'fa-file-o'\"></i>{{res.name}}</a>\n" +
    "          </td>\n" +
    "          <td ng-hide=\"res.type==='-'\">{{res.size|fileSize}}</td>\n" +
    "          <td ng-hide=\"res.type==='-'\"><div tooltip-placement=\"bottom\" tooltip=\"{{res.mtime|classicDate}}\">{{res.mtime|fromNow}}</div></td>\n" +
    "          <td class=\"right\">\n" +
    "              <div class=\"btn-group\" dropdown is-open=\"status.isopen\">\n" +
    "                <button type=\"button\" class=\"btn btn-primary dropdown-toggle\" ng-disabled=\"disabled\">\n" +
    "                  <i class=\"fa fa-angle-double-down\"></i>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu dropdown-menu-right left\" role=\"menu\">\n" +
    "                  <!-- <li><a ng-show=\"res.type != 'Directory'\"><i class=\"fa fa-2x fa-pencil-square-o fa-fw vmiddle\"></i> View/Edit</a></li> -->\n" +
    "                  <li><a ng-click=\"openACLEditor(resources, res.uri, res.type)\"><i class=\"fa fa-2x fa-unlock-alt fa-fw vmiddle\"></i> Permissions</a></li>\n" +
    "                  <li><a ng-click=\"openDelete(res.uri)\"><i class=\"fa fa-2x fa-trash-o fa-fw vmiddle\"></i> Delete</a></li>\n" +
    "                  <li><a ng-click=\"openFileEditor(res.uri)\"><i class=\"fa fa-2x fa-pencil fa-fw vmiddle\"></i> Edit</a></li>\n" +
    "                </ul>\n" +
    "              </div>\n" +
    "          </td>\n" +
    "      </tr>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <!-- New location modal -->\n" +
    "  <script type=\"text/ng-template\" id=\"newlocation.html\">\n" +
    "    <div>\n" +
    "      <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\">Please provide a location for the data server:</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "          <form name=\"newLocName\">\n" +
    "            <fieldset>\n" +
    "              <input type=\"text\" ng-model=\"locName\" name=\"locName\" id=\"locName\" class=\"nginput pull-left\" placeholder=\"https://dredd.solid.community/public/\" value=\"https://dredd.solid.community/public/\" ng-focus=\"isFocused\" ng-keypress=\"($event.which === 13)?newLoc(locName):0\">\n" +
    "            </fieldset>\n" +
    "          </form>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "          <button class=\"btn btn-primary\" ng-click=\"newLoc(locName)\">OK</button>\n" +
    "          <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "\n" +
    "  <!-- New dir modal -->\n" +
    "  <script type=\"text/ng-template\" id=\"newdir.html\">\n" +
    "    <div>\n" +
    "      <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\">New directory</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "          <form name=\"newDirName\">\n" +
    "            <fieldset>\n" +
    "              <input type=\"text\" ng-model=\"dirName\" name=\"dirName\" id=\"dirName\" class=\"nginput\" placeholder=\"dir name..\" ng-focus=\"isFocused\" ng-keypress=\"($event.which === 13)?newDir(dirName):0\">\n" +
    "              <span ng-hide=\"newDirName.dirName.$valid\">Only use: a-z A-Z 0-9 _ -</span>\n" +
    "            </fieldset>\n" +
    "          </form>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "          <button class=\"btn btn-primary\" ng-click=\"newDir(dirName)\">OK</button>\n" +
    "          <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "\n" +
    "  <!-- New file modal -->\n" +
    "  <script type=\"text/ng-template\" id=\"newfile.html\">\n" +
    "    <div>\n" +
    "      <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\">New file</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "          <form name=\"newFileName\">\n" +
    "            <fieldset>\n" +
    "              <input type=\"text\" ng-model=\"fileName\" name=\"fileName\" id=\"fileName\" class=\"nginput\" placeholder=\"file name..\" ng-focus=\"isFocused\" ng-keypress=\"($event.which === 13)?newFile(fileName):0\" />\n" +
    "              <!-- <span ng-hide=\"newFileName.fileName.$valid\">Only use: a-z A-Z 0-9 _ - .</span> -->\n" +
    "            </fieldset>\n" +
    "          </form>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "          <button class=\"btn btn-primary\" ng-click=\"newFile(fileName)\">OK</button>\n" +
    "          <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "\n" +
    "  <!-- File editor modal -->\n" +
    "  <script type=\"text/ng-template\" id=\"fileEditor.html\">\n" +
    "    <div>\n" +
    "      <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\">File Editor</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "          <form name=\"newFileContent\">\n" +
    "            <fieldset>\n" +
    "              <textarea id=\"fileContent\" name=\"fileContent\" class=\"nginput-new\"></textarea>\n" +
    "              <!-- <span ng-hide=\"newFileName.fileName.$valid\">Only use: a-z A-Z 0-9 _ - .</span> -->\n" +
    "            </fieldset>\n" +
    "          </form>\n" +
    "          <br/><small class=\"orange\">Warning: any changes to this file will overwrite it!</small>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "          <button class=\"btn btn-primary\" ng-click=\"updateFile(fileContent)\">Save</button>\n" +
    "          <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    </script>\n" +
    "\n" +
    "  <!-- Upload file modal -->\n" +
    "  <script type=\"text/ng-template\" id=\"uploadfiles.html\">\n" +
    "    <div>\n" +
    "      <div class=\"modal-header\">\n" +
    "        <h3 class=\"modal-title\">Upload files to <strong>{{container}}/</strong></h3>\n" +
    "      </div>\n" +
    "      <div class=\"modal-body\">\n" +
    "        <input type=\"file\" ng-file-select=\"onFileSelect($files)\" data-multiple=\"true\" multiple=\"multiple\">\n" +
    "        <div ng-file-drop=\"onFileSelect($files)\" ng-file-drag-over-class=\"'dropzone-on'\" class=\"dropzone\" ng-show=\"dropSupported\">\n" +
    "          Drop files here\n" +
    "        </div>\n" +
    "        <div ng-file-drop-available=\"dropSupported=true\" ng-show=\"!dropSupported\">\n" +
    "          HTML5 Drop File is not supported!\n" +
    "        </div>\n" +
    "        <table class=\"upload-files\" ng-show=\"selectedFiles.length > 0\">\n" +
    "          <tr>\n" +
    "            <td><strong>File name</strong></td>\n" +
    "            <td><strong>Status</strong></td>\n" +
    "            <td></td>\n" +
    "          </tr>\n" +
    "          <tr ng-repeat=\"file in selectedFiles track by $index\" ng-class=\"progress[file.name] == 100?'done':''\">\n" +
    "            <td>{{file.name|truncate:25}}</td>\n" +
    "            <td><div tooltip-placement=\"bottom\" tooltip=\"Uploading...{{progress[file.name]}}%\"><progressbar value=\"progress[file.name]\"></progressbar></div></td>\n" +
    "            <td class=\"pull-right\">\n" +
    "              <button ng-hide=\"progress[file.name] == 100\" class=\"btn btn-mini btn-default\" ng-click=\"abort(file.name)\"><i class=\"fa fa-2x fa-times\"></i></button>\n" +
    "              <button ng-show=\"progress[file.name] == 100\" class=\"btn btn-mini btn-default\" ng-click=\"remove(file.name)\"><i class=\"fa fa-2x fa-trash-o\"></i></button>\n" +
    "            </td>\n" +
    "          </tr>\n" +
    "        </table>\n" +
    "      </div>\n" +
    "      <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"clearUploaded()\" ng-show=\"selectedFiles.length > 0\">Clear files</button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"cancel()\">Close</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "\n" +
    "  <!-- Remove resource modal -->\n" +
    "  <script type=\"text/ng-template\" id=\"delete.html\">\n" +
    "    <div>\n" +
    "      <div class=\"modal-header\">\n" +
    "            <h3 class=\"modal-title\"><i class=\"fa fa-2x fa-trash-o fa-fw vmiddle\"></i> Delete resource</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "          <p>Are you sure you want to delete:</p>\n" +
    "          <p><strong>{{resource}}</strong></p>\n" +
    "          <small>Note: make sure directories are empty before removing them.</small>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "          <button class=\"btn btn-primary\" ng-click=\"deleteResource(resource)\">Yes</button>\n" +
    "          <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "\n" +
    "  <!-- ACL editor modal -->\n" +
    "  <script type=\"text/ng-template\" id=\"acleditor.html\">\n" +
    "    <div>\n" +
    "      <div class=\"modal-header\">\n" +
    "        <h3 class=\"modal-title\">Permissions for <strong>{{resource}}</strong></h3>\n" +
    "        <img ng-src=\"assets/loading.gif\" ng-show=\"loading\">\n" +
    "      </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "          <table class=\"full-width\">\n" +
    "            <tr>\n" +
    "              <td class=\"pull-left\">\n" +
    "                <div class=\"permission-icons\">\n" +
    "                  <strong>Owners</strong>\n" +
    "                  <br/>\n" +
    "                  <i class=\"fa fa-2x fa-lock vmiddle\"></i>\n" +
    "                </div>\n" +
    "              </td>\n" +
    "              <td class=\"vtop policies\">\n" +
    "                <div class=\"policy\" ng-hide=\"gotOwner\">\n" +
    "                  <h3 class=\"orange\">Attention!</h3>\n" +
    "                  You will not be able to update this policy in the future if you do not set at least one owner. Click the button below to add an owner.\n" +
    "                </div>\n" +
    "                <div class=\"policy\" ng-repeat=\"policy in policies|filter:{cat: 'owner'}\">\n" +
    "                  <div class=\"pull-left\">\n" +
    "                    <img ng-src=\"assets/loading.gif\" ng-show=\"policy.loading\" />\n" +
    "                    <button class=\"btn btn-sm\" ng-click=\"removePolicy(policy.$$hashKey)\" ng-hide=\"policy.loading\"><i class=\"fa fa-trash-o orange\"></i></button>\n" +
    "                    <a href=\"{{policy.webid}}\" target=\"_blank\" ng-show=\"policy.webid\">{{trunc(policy.fullname, 24)}}</a>\n" +
    "                    <div class=\"inline-block\" ng-show=\"policy.key\">\n" +
    "                      Key: {{trunc(policy.fullname, 24)}}\n" +
    "                      <a href=\"{{uri}}?key={{policy.key}}\" target=\"_blank\">Link</a>\n" +
    "                    </div>\n" +
    "\n" +
    "                  </div>\n" +
    "                  <br>\n" +
    "                </div>\n" +
    "                <div class=\"spacer\">\n" +
    "                  <div class=\"policy\" ng-show=\"newUser['owner']\">\n" +
    "                    <input class=\"new-user vmiddle\" type=\"text\" ng-focus=\"isFocused\" ng-model=\"newUser['owner'].webid\" typeahead=\"match.webid as match.name for match in lookupWebID($viewValue)|filter:{name:$viewValue}|limitTo:8\" typeahead-loading=\"searchloading\" typeahead-min-length=\"2\" typeahead-wait-ms=\"200\" typeahead-on-select=\"addNewUser('owner', $item.webid)\"/>\n" +
    "                    <img ng-src=\"assets/loading.gif\" ng-show=\"searchloading\" />\n" +
    "                    <button class=\"btn btn-sm btn-primary\" ng-click=\"addNewUser('owner', newUser['owner'].webid)\"><i class=\"fa fa-2x fa-check-circle-o\"></i></button>\n" +
    "                    <button class=\"btn btn-sm\" ng-click=\"cancelNewUser('owner')\"><i class=\"fa fa-2x fa-times-circle-o\"></i></button>\n" +
    "                    <br/>\n" +
    "                  </div>\n" +
    "                  <div class=\"policy\" ng-show=\"newKey['owner']\">\n" +
    "                    <input class=\"new-user vmiddle\" type=\"text\" ng-focus=\"isFocused\" ng-model=\"newKey['owner'].key\">\n" +
    "                    <button class=\"btn btn-sm btn-primary\" ng-click=\"generateNewKey(newKey['owner'])\" tooltip-placement=\"bottom\" tooltip=\"Generate a random key\"><i class=\"fa fa-2x fa-key\"></i></button>\n" +
    "                    <button class=\"btn btn-sm btn-primary\" ng-click=\"addNewKey('owner', newKey['owner'].key)\" ng-disabled=\"newKey['owner'].key.length === 0\"><i class=\"fa fa-2x fa-check-circle-o\"></i></button>\n" +
    "                    <button class=\"btn btn-sm\" ng-click=\"cancelNewKey('owner')\"><i class=\"fa fa-2x fa-times-circle-o\"></i></button>\n" +
    "                    <br/>\n" +
    "                  </div>\n" +
    "                  <button class=\"btn btn-primary\" ng-click=\"showNewUser('owner')\" ng-hide=\"newUser['owner']\">Add user</button>\n" +
    "                  <button class=\"btn btn-primary\" ng-click=\"showNewKey('owner')\" ng-hide=\"newKey['owner']\">Add key</button>\n" +
    "                </div>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "            <tr><td colspan=\"2\"><hr/></td></tr>\n" +
    "            <tr>\n" +
    "              <td class=\"pull-left\">\n" +
    "                <div class=\"permission-icons\">\n" +
    "                  <strong>Others</strong>\n" +
    "                  <br/>\n" +
    "                  <i class=\"fa fa-2x fa-users vmiddle\"></i>\n" +
    "                </div>\n" +
    "              </td>\n" +
    "              <td class=\"vtop policies\">\n" +
    "                <div class=\"policy\" ng-repeat=\"policy in policies|filter:{cat: 'others'}\">\n" +
    "                  <div class=\"pull-left\">\n" +
    "                    <img ng-src=\"assets/loading.gif\" ng-show=\"policy.loading\" />\n" +
    "                    <button class=\"btn btn-sm\" ng-click=\"removePolicy(policy.$$hashKey)\" ng-hide=\"policy.loading\"><i class=\"fa fa-trash-o orange\"></i></button>\n" +
    "                    <a href=\"{{policy.webid}}\" target=\"_blank\" ng-show=\"policy.webid\">{{trunc(policy.fullname, 24)}}</a>\n" +
    "                    <div class=\"inline-block\" ng-show=\"policy.key\">\n" +
    "                      Key: {{trunc(policy.fullname, 24)}}\n" +
    "                      <a href=\"{{uri}}?key={{policy.key}}\" target=\"_blank\">Link</a>\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                  <div class=\"boxes pull-right\">\n" +
    "                      <input type=\"checkbox\" ng-model=\"policy.modes.Read\" class=\"inline-block\"><div class=\"inline-block mode-label\">Read</div>\n" +
    "                      <input type=\"checkbox\" ng-model=\"policy.modes.Write\" class=\"inline-block\"><div class=\"inline-block mode-label\">Write</div>\n" +
    "                      <input type=\"checkbox\" ng-model=\"policy.modes.Append\" class=\"inline-block\"><div class=\"inline-block mode-label\" tooltip-placement=\"bottom\" tooltip=\"Able to write without reading or deleting.\">Append</div>\n" +
    "                      <br/>\n" +
    "                  </div>\n" +
    "                  <br/>\n" +
    "                </div>\n" +
    "                <div class=\"spacer\">\n" +
    "                  <div class=\"policy\" ng-show=\"newUser['others']\">\n" +
    "                    <input class=\"new-user vmiddle\" type=\"text\" ng-focus=\"isFocused\" ng-model=\"newUser['others'].webid\" typeahead=\"match.webid as match.name for match in lookupWebID($viewValue)|filter:{name:$viewValue}|limitTo:8\" typeahead-loading=\"searchloading\" typeahead-min-length=\"2\" typeahead-wait-ms=\"200\" typeahead-on-select=\"addNewUser('others', $item.webid)\"/>\n" +
    "                    <img ng-src=\"assets/loading.gif\" ng-show=\"searchloading\" />\n" +
    "                    <button class=\"btn btn-sm btn-primary\" ng-click=\"addNewUser('others', newUser['others'].webid)\"><i class=\"fa fa-2x fa-check-circle-o\"></i></button>\n" +
    "                    <button class=\"btn btn-sm\" ng-click=\"cancelNewUser('others')\"><i class=\"fa fa-2x fa-times-circle-o\"></i></button>\n" +
    "                    <br/>\n" +
    "                  </div>\n" +
    "                  <div class=\"policy\" ng-show=\"newKey['others']\">\n" +
    "                    <input class=\"new-user vmiddle\" type=\"text\" ng-focus=\"isFocused\" ng-model=\"newKey['others'].key\">\n" +
    "                    <button class=\"btn btn-sm btn-primary\" ng-click=\"generateNewKey(newKey['others'])\" tooltip-placement=\"bottom\" tooltip=\"Generate a random key\"><i class=\"fa fa-2x fa-key\"></i></button>\n" +
    "                    <button class=\"btn btn-sm btn-primary\" ng-click=\"addNewKey('others', newKey['others'].key)\" ng-disabled=\"newKey['others'].key.length === 0\"><i class=\"fa fa-2x fa-check-circle-o\"></i></button>\n" +
    "                    <button class=\"btn btn-sm\" ng-click=\"cancelNewKey('others')\"><i class=\"fa fa-2x fa-times-circle-o\"></i></button>\n" +
    "                    <br/>\n" +
    "                  </div>\n" +
    "                  <button class=\"btn btn-primary\" ng-click=\"showNewUser('others')\" ng-hide=\"newUser['others']\">Add user</button>\n" +
    "                  <button class=\"btn btn-primary\" ng-click=\"showNewKey('others')\" ng-hide=\"newKey['others']\">Add key</button>\n" +
    "                </div>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "            <tr><td colspan=\"2\"><hr/></td></tr>\n" +
    "            <tr>\n" +
    "              <td class=\"pull-left\">\n" +
    "                <div class=\"permission-icons\">\n" +
    "                  <strong>Everyone</strong>\n" +
    "                  <br/>\n" +
    "                  <i class=\"fa fa-2x fa-unlock-alt vmiddle\"></i>\n" +
    "                </div>\n" +
    "              </td>\n" +
    "              <td class=\"vtop policies\">\n" +
    "                <div ng-repeat=\"policy in policies|filter:{cat: 'any'}|limitTo:1\">\n" +
    "                  <div class=\"boxes pull-right\">\n" +
    "                      <input type=\"checkbox\" ng-model=\"policy.modes.Read\" class=\"inline-block\"><div class=\"inline-block mode-label\">Read</div>\n" +
    "                      <input type=\"checkbox\" ng-model=\"policy.modes.Write\" class=\"inline-block\"><div class=\"inline-block mode-label\">Write</div>\n" +
    "                      <input type=\"checkbox\" ng-model=\"policy.modes.Append\" class=\"inline-block\"><div class=\"inline-block mode-label\" tooltip-placement=\"bottom\" tooltip=\"Able to write without reading or deleting.\">Append</div>\n" +
    "                      <br/>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "          </table>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "          <button class=\"btn btn-primary\" ng-click=\"setAcl()\" ng-disabled=\"disableOk\">\n" +
    "            <span ng-hide=\"disableOk\">\n" +
    "              Save\n" +
    "            </span>\n" +
    "\n" +
    "            <span ng-show=\"disableOk\">\n" +
    "              Saving\n" +
    "              <i class=\"fa fa-spinner fa-spin\"></i>\n" +
    "            </span>\n" +
    "          </button>\n" +
    "          <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "  </script>\n" +
    "  <script type=\"text/ng-template\" id=\"webidresults.html\">\n" +
    "    <a>\n" +
    "        <img ng-src=\"{{match.img}}\" width=\"16\">\n" +
    "        <span bind-html-unsafe=\"match.name | typeaheadHighlight:query\"></span>\n" +
    "    </a>\n" +
    "  </script>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);
