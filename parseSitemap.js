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
    mxResources.parse('fromSitemap=Insert from Sitemap');
    mxResources.parse('fromSitemapXmlFile=From Sitemap XML File');
    
    // Adds action : fromSitemap
    ui.actions.addAction('fromSitemap', function() {
    	ui.showDialog(new InsertSitemap(ui).container, 620, 420, true, true);
    	ui.dialog.container.style.overflow = 'auto';
    }, null, null, '');
    
    ui.keyHandler.bindAction(81, !0, 'fromSitemap', !0);
    
    // Adds action : fromSitemapXmlFile
    ui.actions.addAction('fromSitemapXmlFile', function() {
    	ui.showDialog(new ParseDialog(ui).container, 620, 420, true, true);
    	ui.dialog.container.style.overflow = 'auto';
    }, null, null, '');
    
    ui.keyHandler.bindAction(81, !0, 'fromSitemapXmlFile', !0);
    
    var uiMenus = ui.menus;
    
    // Adds menu
    ui.menubar.addMenu('Sitemap', function(menu, parent) {
       uiMenus.addMenuItem(menu, 'fromSitemap');
       //uiMenus.addMenuItem(menu, 'fromSitemapXmlFile');
    });
    
	/* Replaces import from menu to add new menu item
	uiMenus.put("importFrom", new Menu(mxUtils.bind(uiMenus, function(menu, parent) {
		uiMenus.addMenuItems(menu, "googleDrive dropbox oneDrive - url - fromSitemapXmlFile".split(" "), parent)
	})));
    
	// Replaces insert menu to add new menu item
	uiMenus.put("insert", new Menu(mxUtils.bind(uiMenus, function(menu, parent) {
        uiMenus.addMenuItems(menu, "insertText insertRectangle insertEllipse - insertLink insertImage - ".split(" "), parent)
        uiMenus.addMenuItems(menu, "horizontalFlow verticalFlow - horizontalTree verticalTree - organic circle - fromText  - fromSitemapText".split(" "), parent);
	})));*/

    // Reorders menubar
    ui.menubar.container
      .insertBefore(ui.menubar.container.lastChild,
                    ui.menubar.container.lastChild.previousSibling.previousSibling);
                    
    // Displays status message
    ui.editor.setStatus('ParseSitemap plugin loaded successfully!');
    
    /**
	 * Constructs a new dialog for sitemap insert.
	 */
	function InsertSitemap(editorUi) {
		function parse(text) {
			var lines = text.split('\n');
			var vertices = new Object();
			var cells = [];
			
			function getOrCreateVertex(id) {
				var newVertex = vertices[id];
	
				if (newVertex == null) {
					var label = id.match(/\/([^\/]+)[\/]?$/);
					newVertex = new mxCell(label[1], new mxGeometry(0, 0, 80, 30),  id + '/');
					newVertex.vertex = true;
					vertices[id] = newVertex;
					cells.push(newVertex);
				}
				
				return newVertex;
			};
			
			for (var i = 0; i < lines.length; i++) {
				if (lines[i].charAt(0) != ';') {
					
					var values = lines[i].split('/');
						
					if (!values[values.length - 1]) {
						values = values.slice(0, -1);
					}
					
					if (values.length > 1) {
						var target = getOrCreateVertex(values.join('/'));
						values = values.slice(0, -1);
						if (values.length > 2) {
							var source = getOrCreateVertex(values.join('/'));
							
							var newEdge = new mxCell('', new mxGeometry());
							newEdge.edge = true;
							source.insertEdge(newEdge, true);
							target.insertEdge(newEdge, false);
							cells.push(newEdge);
						}
					}
				}
			}
			
			if (cells.length > 0) {
				var graph = editorUi.editor.graph;
				
				graph.getModel().beginUpdate();
				try {
					cells = graph.importCells(cells);
					
					for (var i = 0; i < cells.length; i++) {
						if (graph.getModel().isVertex(cells[i])) {
							var size = graph.getPreferredSizeForCell(cells[i]);
							graph.setLinkForCell(cells[i], cells[i].getStyle());
							cells[i].setStyle = null;
							cells[i].geometry.width = Math.max(cells[i].geometry.width, size.width);
							cells[i].geometry.height = Math.max(cells[i].geometry.height, size.height);
						}
					}
	
					var layout = new mxCompactTreeLayout(graph, false);
					layout.disableEdgeStyle = false;
					layout.forceConstant = 120;
					layout.execute(graph.getDefaultParent());
					
					graph.moveCells(cells, 20, 20);
				}
				finally {
					graph.getModel().endUpdate();
				}
			}
		};
		
		var div = document.createElement('div');
		div.style.textAlign = 'right';
		
		var textarea = document.createElement('textarea');
		textarea.style.width = '600px';
		textarea.style.height = '374px';
		
		textarea.value = ';example\nhttp://www.chrisplaw.com/bus-accidents/\nhttp://www.chrisplaw.com/car-accidents/\nhttp://www.chrisplaw.com/car-accidents/compensation/\nhttp://www.chrisplaw.com/car-accidents/what-do-i-need-to-do/\n';
		div.appendChild(textarea);
		
		// Enables dropping files
		if (fileSupport) {
			function handleDrop(evt) {
			    evt.stopPropagation();
			    evt.preventDefault();
			    
			    if (evt.dataTransfer.files.length > 0) {
			    	var file = evt.dataTransfer.files[0];
	    			
					var reader = new FileReader();
					reader.onload = function(e) { textarea.value = e.target.result; };
					reader.readAsText(file);
	    		}
			};
			
			function handleDragOver(evt) {
				evt.stopPropagation();
				evt.preventDefault();
			};
	
			// Setup the dnd listeners.
			textarea.addEventListener('dragover', handleDragOver, false);
			textarea.addEventListener('drop', handleDrop, false);
		}
	
		div.appendChild(mxUtils.button(mxResources.get("insert"), function() {
			parse(textarea.value);
			editorUi.hideDialog();
		}));
		
		div.appendChild(mxUtils.button(mxResources.get('cancel'), function() {
			editorUi.hideDialog();
		}));
		
		this.container = div;
	};
});
