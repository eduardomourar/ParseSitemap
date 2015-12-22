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
	 * Constructs a new dialog to insert sitemap data.
	 */
	function InsertSitemap(editorUi) {
		function parse(text) {
			var lines = text.split('\n');
			var vertices = new Object();
			var edges = new Object();
			var cells = [];
			
			function getVertex(id) {
				var newVertex = vertices[id];
	
				if (!newVertex) {
					var label = id.match(/\/([^\/]+)[\/]?$/);
					newVertex = new mxCell(label[1], new mxGeometry(0, 0, 80, 30),  id);
					newVertex.vertex = true;
					vertices[id] = newVertex;
					cells.push(newVertex);
				}
				
				return newVertex;
			};
			
			function createConnection(srcValue, tgtValue) {
				if (srcValue) {
					var source = getVertex(srcValue);
				}
				
				if (tgtValue) {
					var target = getVertex(tgtValue);
					var newEdge = edges[target.getStyle()];
		
					if (!newEdge) {
						newEdge = new mxCell('', new mxGeometry(), "edgeStyle\x3dorthogonalEdgeStyle;");
						newEdge.edge = true;
						edges[target.getStyle()] = newEdge;
						source.insertEdge(newEdge, true);
						target.insertEdge(newEdge, false);
						cells.push(newEdge);
					}
				}
			};
			
			for (var i = 0; i < lines.length; i++) {
				if (lines[i].charAt(0) != ';') {
					
					var values = lines[i].split('/');
						
					if (!values[values.length - 1]) {
						values = values.slice(0, -1);
					}
					
					var src = null, tgt = null;
					
					for (var j = values.length; j > 3; j--) {
						var tgt = values.join('/');
						values = values.slice(0, -1);
						var src = values.join('/');
						
						createConnection(src, tgt);
					}
				}
			}
			
			if (cells.length > 0) {
                newElement = document.createElement('div');
                newElement.style.visibility = 'hidden';
                document.body.appendChild(newElement);
				var graph = new Graph(newElement);
				
				graph.getModel().beginUpdate();
				try {
					cells = graph.importCells(cells);
					
					for (var i = 0; i < cells.length; i++) {
						if (graph.getModel().isVertex(cells[i])) {
							var size = graph.getPreferredSizeForCell(cells[i]);
							graph.setLinkForCell(cells[i], cells[i].getStyle());
							cells[i].setStyle('');
							cells[i].geometry.width = Math.max(cells[i].geometry.width, size.width);
							cells[i].geometry.height = Math.max(cells[i].geometry.height, size.height);
						}
					}
	
					var layout = new mxCompactTreeLayout(graph, false);// mxHierarchicalLayout(graph);
					layout.disableEdgeStyle = false;
					layout.forceConstant = 120;
					layout.edgeRouting = false;
					layout.levelDistance = 30;
					layout.execute(graph.getDefaultParent());
					
					graph.moveCells(cells, 20, 20);
				}
				finally {
					graph.getModel().endUpdate();
				}
                graph.clearCellOverlays();
                layout = editorUi.editor.graph.view;
                bounds = editorUi.editor.graph.getGraphBounds();
                size = Math.max(0, bounds.x / layout.scale - layout.translate.x) + graph.gridSize;
                layout = Math.max(0, (bounds.y + bounds.height) / layout.scale - layout.translate.y) + 4 * graph.gridSize;
                editorUi.editor.graph.setSelectionCells(editorUi.editor.graph.importCells(graph.getModel().getChildren(graph.getDefaultParent()), size, layout));
                graph.destroy();
                newElement.parentNode.removeChild(newElement);
			}
		};
		
		var div = document.createElement('div');
		div.style.textAlign = 'right';
		
		var textarea = document.createElement('textarea');
	    textarea.style.resize = 'none';
        textarea.style.width = '100%';
        textarea.style.height = '354px';
        textarea.style.marginBottom = '16px';
		
		textarea.value = ';example\nhttp://www.google.com/edu/\nhttp://www.google.com/edu/partners/\nhttp://www.google.com/edu/stories/\nhttp://www.google.com/edu/stories/index.html\n';
		div.appendChild(textarea);
		
        this.init = function() {
            div.focus()
        };
		
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
		
		var dialogButton = mxUtils.button(mxResources.get('cancel'), function() {
            editorUi.confirm(mxResources.get('areYouSure'), function() {
				editorUi.hideDialog();
			})
		});
		dialogButton.className = 'geBtn';
		div.appendChild(dialogButton);
		
		dialogButton = mxUtils.button(mxResources.get('insert'), function() {
			parse(textarea.value);
			editorUi.hideDialog();
		});
		dialogButton.className = 'geBtn gePrimaryBtn';
		div.appendChild(dialogButton);
		
		this.container = div;
	};
});
