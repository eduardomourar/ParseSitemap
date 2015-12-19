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
    mxResources.parse('myParseSitemap=From Sitemap Text');
    
    // Adds action : myParseSitemap
    ui.actions.addAction('myParseSitemap', function() {
    	ui.showDialog(new ParseDialog(ui).container, 620, 420, true, true);
    	ui.dialog.container.style.overflow = 'auto';
    }, null, null, "Ctrl+Shift+S");
    
    ui.keyHandler.bindAction(81, !0, "myParseSitemap", !0);
    
    // Adds menu
    ui.menus.put('arrange', new Menu(mxUtils.bind(ui.menus, function(menu, parent)
	{
	    ui.menus.addMenuItems(menu, 'myParseSitemap', parent);
	})));
    /*ui.menubar.addMenu('Sitemap', function(menu, parent) {
        ui.menus.addMenuItem(menu, 'myParseSitemap');
    });*/

    // Reorders menubar
    ui.menubar.container
      .insertBefore(ui.menubar.container.lastChild,
                    ui.menubar.container.lastChild.previousSibling.previousSibling);
                    
    // Displays status message
    ui.editor.setStatus('ParseSitemap plugin loaded successfully!');
});
