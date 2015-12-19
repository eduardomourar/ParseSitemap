/**
* A draw.io plugin for parsing a sitemap XML or spreadsheet into
* a sitemap diagram showing the root with their children sites.
* Author: eduardomourar@gmail.com
* Company: Crossover Marketing
* Created: 2015-12-21
*/
Draw.loadPlugin(function(ui) {
    /* Finding assigned keys:
    
      * Open javascript console
      * Draw.valueOf()
      * Traverse to: Object > loadPlugin > <function scope> 
                    > ui > keyHandler > controlShiftKeys
      * The number here is ASCII character code 
    */
    
    // Adds resources for actions
    mxResources.parse('fromSitemapXmlFile=From Sitemap XML File');
    mxResources.parse('fromSitemapText=From Sitemap Text');
    
    // Adds action : fromSitemapXmlFile
    ui.actions.addAction('fromSitemapXmlFile', function() {
    	ui.showDialog(new ParseDialog(ui).container, 620, 420, true, true);
    	ui.dialog.container.style.overflow = 'auto';
    }, null, null, '');
    
    ui.keyHandler.bindAction(81, !0, 'fromSitemapXmlFile', !0);
    
    // Adds action : fromSitemapText
    ui.actions.addAction('fromSitemapText', function() {
    	ui.showDialog(new ParseDialog(ui).container, 620, 420, true, true);
    	ui.dialog.container.style.overflow = 'auto';
    }, null, null, '');
    
    ui.keyHandler.bindAction(81, !0, 'fromSitemapText', !0);
    
    var uiMenus = ui.menus;
    
    /* Adds menu
    uiMenus.put('import', new Menu(mxUtils.bind(uiMenus, function(menu, parent) {
	    ui.menus.addMenuItems(menu, ['-', 'myParseSitemap'], parent);
	})));
    ui.menubar.addMenu('Sitemap', function(menu, parent) {
        ui.menus.addMenuItem(menu, 'myParseSitemap');
    });*/
    
	// Replaces import from menu to add new menu item
	uiMenus.put("importFrom", new Menu(mxUtils.bind(uiMenus, function(menu, parent) {
        uiMenus.addMenuItems(menu, "googleDrive dropbox oneDrive - url - fromSitemapXmlFile".split(" "), parent)
	})));
    
	// Replaces insert menu to add new menu item
	uiMenus.put("insert", new Menu(mxUtils.bind(uiMenus, function(menu, parent) {
        /*uiMenus.addMenuItems(menu, ["insertText", "insertRectangle", "insertEllipse", "-", "insertLink"], parent);
        uiMenus.addMenuItem(menu, "image", parent).firstChild.nextSibling.innerHTML = mxResources.get("insertImage");
        menu.addSeparator(parent);*/
        uiMenus.addMenuItems(menu, "insertText insertRectangle insertEllipse - insertLink insertImage - ".split(" "), parent)
        uiMenus.addMenuItems(menu, "horizontalFlow verticalFlow - horizontalTree verticalTree - organic circle - fromText  - fromSitemapText".split(" "), parent);
	})));

    // Reorders menubar
    ui.menubar.container
      .insertBefore(ui.menubar.container.lastChild,
                    ui.menubar.container.lastChild.previousSibling.previousSibling);
                    
    // Displays status message
    ui.editor.setStatus('ParseSitemap plugin loaded successfully!');
});
