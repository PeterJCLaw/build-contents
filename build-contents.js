
function walk(root, cb) {
	cb(root);
	for(var i=0; i < root.childNodes.length; i++) {
		walk(root.childNodes[i], cb);
	}
}

// This figures out where in the tree it goes
function addHeading(h, node, level) {
	if(level != 1) {
		addHeading(h[h.length-1].children, node, level-1);
	} else {
		h.push(node);
	}
}

function makeList(tree) {
	var ol = createDOM('ol');
	for(var i=0; i < tree.length; i++) {
		var node = tree[i];
		var li = createDOM('li');
		li.innerHTML = node.node.innerHTML;
		var sub_ol = makeList(node.children);
		li.appendChild(sub_ol);
		ol.appendChild(li);
	}
	return ol;
}

function createDOM(tag, properties) {
	var e = document.createElement(tag);
	for(var p in properties) {
		e.setAttribute(p, properties[p]);
	}
	return e;
}

headings = [];
//headings = [{h,c:[]},{},{}]

function buildContents(opts_in) {
	var opts = opts_in || {};
	var id = opts.id || 'contents-box';
	walk(document, function(node) {
		if(node.tagName != null
		&& node.tagName.length == 2
		&& node.tagName.toLowerCase()[0] == 'h')
		{
			addHeading(headings, {
			    level:node.tagName[1],
			     node:node,
			 children:[]
			}, node.tagName[1]);
		}
	});

	var box = createDOM('div', { id: id });

	var list = makeList(headings);
	box.appendChild(list);

	document.body.appendChild(box)
}