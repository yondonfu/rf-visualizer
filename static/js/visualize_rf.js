$(function() {
  $('#train-button').bind('click', function() {
    $.ajax({
      url:'/train',
    }).done(function(data) {
      if (data.result == true) {
        console.log("Success");
        update(roots[0]);
        update(roots[1]);
        update(roots[2]);
        update(roots[3]);
      }
    });
  });

});

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

var margin = {top: 10, right: 120, bottom: 10, left: 200},
  width = 1200 - margin.right - margin.left,
  height = 230 - margin.top - margin.bottom;

var i = 0, duration = 750

var roots = [0, 0, 0, 0];

var tree = d3.layout.tree().size([height, width]);

var diagonal = d3.svg.diagonal().projection(function(d) {
  return [d.y, d.x];
});

// Initialize all svg
var svgList = [0, 0, 0, 0];

for (j = 0; j < svgList.length; j++) {
  svgList[j] = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

d3.json("../../static/data/tree_0.json", function(error, treeData) {
  roots[0] = formatJson(treeData);
  roots[0].x0 = height;
  roots[0].y0 = 0;
});

d3.json("../../static/data/tree_1.json", function(error, treeData) {
  roots[1] = formatJson(treeData);
  roots[1].x0 = height;
  roots[1].y0 = 0;
});

d3.json("../../static/data/tree_2.json", function(error, treeData) {
  roots[2] = formatJson(treeData);
  roots[2].x0 = height;
  roots[2].y0 = 0;
});

d3.json("../../static/data/tree_3.json", function(error, treeData) {
  roots[3] = formatJson(treeData);
  roots[3].x0 = height;
  roots[3].y0 = 0;
});


d3.select(self.frameElement).style("height", "500px");

function update(source) {

  var treeNodes = [0, 0, 0, 0];
  var treeLinks = [0, 0, 0, 0];
  var nodeList = [0, 0, 0, 0];
  var nodeEnters = [0, 0, 0, 0];
  var nodeUpdates = [0, 0, 0, 0];
  var nodeExits = [0, 0, 0, 0];
  var linkList = [0, 0, 0, 0];

  for (j = 0; j < roots.length; j++) {
    // Compute the new tree layout.
    treeNodes[j] = tree.nodes(roots[j]).reverse();
    treeLinks[j] = tree.links(treeNodes[j]);

    // Normalize for fixed-depth.
    treeNodes[j].forEach(function(d) { d.y = d.depth * 180; });

    // Update nodes
    nodeList[j] = svgList[j].selectAll("g.node")
      .data(treeNodes[j], function(d) { return d.id || (d.id = ++i); });

    // Enter new nodes at parent's prev pos
    nodeEnters[j] = nodeList[j].enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

    nodeEnters[j].append("circle")
      .attr("r", 1e-6)
      .attr("fill", function(d) { return d._children ? "lightsteelblue": "#fff"; });

    nodeEnters[j].append("text")
      .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    nodeUpdates[j] = nodeList[j].transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdates[j].select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdates[j].select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    nodeExits[j] = nodeList[j].exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExits[j].select("circle")
      .attr("r", 1e-6);

    nodeExits[j].select("text")
      .style("fill-opacity", 1e-6);

     // Update links
    linkList[j] = svgList[j].selectAll("path.link")
      .data(treeLinks[j], function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    linkList[j].enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
      });

    // Transition links to their new position.
    linkList[j].transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    linkList[j].exit().transition()
      .duration(duration)
      .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    treeNodes[j].forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

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