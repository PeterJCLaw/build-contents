
/**
 * Add a trim method to the string prototype.
 * Removes preceding and trailing whitespace.
 */
String.prototype.trim = function () {
	return this.replace(/^\s*/, '').replace(/\s*$/, '');
}

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

function makeList(tree, opts) {
	var type = opts.ordered ? 'ol' : 'ul';
	var list = createDOM(type);
	for(var i=0; i < tree.length; i++) {
		var node = tree[i];
		var li = createDOM('li');

		if(opts.forceLinks && node.node.id == '') {
			var text = node.node.innerHTML;
			var id = text.trim().replace(/\s+/g, '-');
			node.node.id = 'JS-h'+node.level+'-'+id;
		}

		if(opts.links && node.node.id) {
			var a = createDOM('a', { href: '#'+node.node.id });
			a.innerHTML = node.node.innerHTML;
			li.appendChild(a);
		} else {
			li.innerHTML = node.node.innerHTML;
		}

		if(node.children.length > 0) {
			var sub_list = makeList(node.children, opts);
			li.appendChild(sub_list);
		}
		list.appendChild(li);
	}
	return list;
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
	opts.links = opts.links || true;
	opts.forceLinks = opts.forceLinks || true;

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

	var list = makeList(headings, opts);

	if(document.getElementById(id) == null) {
		var box = createDOM('div', { id: id });
		box.appendChild(list);
		document.body.appendChild(box)
	} else {
		document.getElementById(id).appendChild(list);
	}
}
