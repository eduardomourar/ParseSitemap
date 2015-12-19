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
    *
    
    // Adds resources for actions
    mxResources.parse('myParseSitemap=From Sitemap Text');
    
    // Adds action : myInsertEllipse
    ui.actions.addAction('myParseSitemap', function() {
        var theGraph = ui.editor.graph;
        if(theGraph.isEnabled() && !theGraph.isCellLocked(theGraph.getDefaultParent())){
          var pos=theGraph.getInsertPoint();
          var newElement=new mxCell("",
                    new mxGeometry(pos.x, pos.y, 80, 80),
                    "ellipse;whiteSpace=wrap;html=1;");
        
          newElement.vertex=!0;
          theGraph.setSelectionCell(theGraph.addCell(newElement))
        }
    }, null, null, "Ctrl+Shift+S");
    
    ui.keyHandler.bindAction(81, !0, "myParseSitemap", !0);
    
    // Adds menu
    ui.menubar.addMenu('Sitemap', function(menu, parent) {
        ui.menus.addMenuItem(menu, 'myParseSitemap');
    });

    // Reorders menubar
    ui.menubar.container
      .insertBefore(ui.menubar.container.lastChild,
                    ui.menubar.container.lastChild.previousSibling.previousSibling);
					*/
					
  // Adds custom sidebar entry
	ui.sidebar.addPalette('helloWorldLibrary', 'Hello, World!', true, function(content)
	{
	    content.appendChild(ui.sidebar.createVertexTemplate(null, 120, 60));
	    content.appendChild(ui.sidebar.createVertexTemplate('rounded=1', 120, 60));
	    content.appendChild(ui.sidebar.createVertexTemplate('ellipse', 80, 80));
	    content.appendChild(ui.sidebar.createVertexTemplate('shape=hexagon', 120, 80));
	    
	    // Image URLs in styles must be public for export
	    content.appendChild(ui.sidebar.createVertexTemplate('shape=image;' +
	    		'aspect=0;image=http://www.jgraph.com/images/mxgraph.gif', 120, 80));

	    content.appendChild(ui.sidebar.createEdgeTemplate('edgeStyle=none;endArrow=none;', 100, 100));
	    content.appendChild(ui.sidebar.createEdgeTemplate('shape=link', 100, 100));
	    content.appendChild(ui.sidebar.createEdgeTemplate('arrow', 100, 100));
	});
	
	// Collapses default sidebar entry and inserts this before
	var c = ui.sidebar.container;
	c.firstChild.click();
	c.insertBefore(c.lastChild, c.firstChild);
	c.insertBefore(c.lastChild, c.firstChild);

	// Adds logo to footer
	ui.footerContainer.innerHTML = '<img align="right" style="margin-top:14px;margin-right:6px;" ' +
		'src="http://www.draw.io/images/logo-small.gif"/>';

	// Adds resource for action
	mxResources.parse('helloWorldAction=Hello, World!');
	
	// Adds action
	ui.actions.addAction('helloWorldAction', function()
	{
		mxUtils.alert('Hello, World');
	});

	// Adds menu
	ui.menubar.addMenu('Hello, World Menu', function(menu, parent)
	{
		ui.menus.addMenuItem(menu, 'helloWorldAction');
	});
	
	// Reorders menubar
	ui.menubar.container.insertBefore(ui.menubar.container.lastChild,
		ui.menubar.container.lastChild.previousSibling.previousSibling);
	
	// Adds toolbar button
	ui.toolbar.addSeparator();
	var elt = ui.toolbar.addItem('', 'helloWorldAction');
	
	// Cannot use built-in sprites
	elt.firstChild.style.backgroundImage = 'url(http://www.draw.io/images/logo-small.gif)';
	elt.firstChild.style.backgroundPosition = '2px 3px';
	
	// Displays status message
	ui.editor.setStatus('Hello, World!');
});
