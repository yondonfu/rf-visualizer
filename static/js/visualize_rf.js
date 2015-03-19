
function formatJson(json) {
  var result = {};

  // Check if node is leaf
  if (!json.left && !json.right) {
    result.name = json.value;

  } else {
    result.name = json.rule;

    // Not a leaf so it must have children
    result.children = [];
  }

  var index = 0;
  if (!!json.left) {
    result.children[index++] = formatJson(json.left);
  }

  if (!!json.right) {
    result.children[index++] = formatJson(json.right);
  }

  return result;
}

var margin = {top: 20, right: 120, bottom: 20, left: 200},
  width = 1200 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom;

var i = 0, duration = 750, root, root1, root2, root3;

var tree = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

// var svgList = [0, 0, 0, 0];

// for (i = 0; i < svgList.length; i++) {
//   svgList[i] = d3.select("body").append("svg")
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// }

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg1 = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.json("../../static/data/tree_0.json", function(error, treeData) {
  root = formatJson(treeData);
  root.x0 = height / 2;
  root.y0 = 0;
  update(root);
});

d3.json("../../static/data/tree_1.json", function(error, treeData) {
  root1 = formatJson(treeData);
  root1.x0 = height / 3;
  root1.y0 = 0;
  update(root1)
});

d3.json("../../static/data/tree_2.json", function(error, treeData) {
  root2 = formatJson(treeData);
  root2.x0 = height / 4;
  root2.y0 = 0;
  update(root2)
});

d3.json("../../static/data/tree_3.json", function(error, treeData) {
  root3 = formatJson(treeData);
  root3.x0 = height / 5;
  root3.y0 = 0;
  update(root3)
});



d3.select(self.frameElement).style("height", "500px");

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  var nodes1 = tree.nodes(root1).reverse(),
    links1 = tree.links(nodes1);

  var nodes2 = tree.nodes(root2).reverse(),
    links2 = tree.links(nodes2);

  var nodes3 = tree.nodes(root3).reverse(),
    links3 = tree.links(nodes3);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  nodes1.forEach(function(d) { d.y = d.depth * 180; });

  nodes2.forEach(function(d) { d.y = d.depth * 180; });

  nodes3.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var node1 = svg1.selectAll("g.node")
    .data(nodes1, function(d) { return d.id || (d.id = ++i); }); 

  var node2 = svg2.selectAll("g.node")
    .data(nodes2, function(d) { return d.id || (d.id = ++i); });

  var node3 = svg3.selectAll("g.node")
    .data(nodes3, function(d) { return d.id || (d.id = ++i); });   

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click);

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);

  var nodeEnter1 = node1.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click);

  nodeEnter1.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter1.append("text")
    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);

  var nodeEnter2 = node2.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click);

  nodeEnter2.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter2.append("text")
    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);

  var nodeEnter3 = node3.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click);

  nodeEnter3.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter3.append("text")
    .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  var nodeUpdate1 = node1.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate1.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate1.select("text")
    .style("fill-opacity", 1);

  var nodeUpdate2 = node2.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate2.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate2.select("text")
    .style("fill-opacity", 1);

  var nodeUpdate3 = node3.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate3.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate3.select("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  var nodeExit1 = node1.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit1.select("circle")
    .attr("r", 1e-6);

  nodeExit1.select("text")
    .style("fill-opacity", 1e-6);

  var nodeExit2 = node2.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit2.select("circle")
    .attr("r", 1e-6);

  nodeExit2.select("text")
    .style("fill-opacity", 1e-6);

  var nodeExit3 = node3.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .remove();

  nodeExit3.select("circle")
    .attr("r", 1e-6);

  nodeExit3.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
  });

  var link1 = svg1.selectAll("path.link")
    .data(links1, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link1.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link1.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link1.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes1.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
  });

  var link2 = svg2.selectAll("path.link")
    .data(links2, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link2.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link2.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link2.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes2.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
  });

  var link3 = svg3.selectAll("path.link")
    .data(links3, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link3.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link3.transition()
    .duration(duration)
    .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link3.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
    var o = {x: source.x, y: source.y};
    return diagonal({source: o, target: o});
    })
    .remove();

  // Stash the old positions for transition.
  nodes3.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
  d._children = d.children;
  d.children = null;
  } else {
  d.children = d._children;
  d._children = null;
  }
  update(d);
}