from warnings import warn
# from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.cross_validation import train_test_split
from sklearn.feature_extraction import DictVectorizer
from sklearn import datasets
import sklearn
from forest import RandomForestClassifier

def get_rf():
  iris = datasets.load_iris()
  samples = iris.data
  labels = iris.target

  train_samples, test_samples, train_labels, test_labels = train_test_split(samples, labels, test_size=.3)

  # classifier = RandomForestClassifier(n_estimators=10, n_jobs=-1, verbose=3, oob_score=True, max_features=None)
  # classifier.fit(train_samples, train_labels)

  # print classifier.score(test_samples, test_labels)
  # print classifier.oob_score_

  classifier = RandomForestClassifier(n_trees=4)
  classifier.fit(train_samples, train_labels)

  for i in range(classifier.n_trees):
    f = open('static/data/tree_' + str(i) + '.json', 'w')
    f.write(tree_json(classifier.trees[i], feature_names=['sepal_length', 'sepal_width', 'petal_length', 'petal_width']))
    f.close()

  print classifier.score(test_samples, test_labels)
  print classifier.oob_score

def get_tree():
  iris = datasets.load_iris()
  samples = iris.data
  labels = iris.target

  train_samples, test_samples, train_labels, test_labels = train_test_split(samples, labels, test_size=.3)

  classifier = DecisionTreeClassifier()
  classifier.fit(train_samples, train_labels)

  print tree_json(classifier, feature_names=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'])


def rf_json(forest, feature_names=None):
  pass

def tree_json(tree, feature_names=None):

  json = ""

  # Converts a node into string format
  def node_to_str(tree, node_id, criterion):

    value = tree.value[node_id]

    if tree.n_outputs == 1:
      value = value[0, :]

    value_str = ', '.join([str(val) for val in value])

    # Check if node is a leaf
    if tree.children_left[node_id] == sklearn.tree._tree.TREE_LEAF:
      return '"id": "%s", "criterion": "%s", "impurity": "%s", "samples": "%s", "value": [%s]' \
        % (node_id, criterion, tree.impurity[node_id], tree.n_node_samples[node_id], value_str)

    else:
      if feature_names is not None:
        feature = feature_names[tree.feature[node_id]]
      else:
        feature = tree.feature[node_id]

      # TODO: Check if feature is discrete category

      rule_type = "<="
      rule_value = "%.4f" % tree.threshold[node_id]

      return '"id": "%s", "rule": "%s %s %s", "%s": "%s", "samples": "%s"' \
        % (node_id, feature, rule_type, rule_value, criterion, tree.impurity[node_id], tree.n_node_samples[node_id])

  # Builds json by recursively traversing down tree
  def recurse_tree(tree, node_id, criterion, parent=None, depth=0):

    tabs = "  " * depth
    json = ""

    left_child = tree.children_left[node_id]
    right_child = tree.children_right[node_id]

    # Root node
    json = json + "\n" + \
      tabs + "{\n" + \
      tabs + "  " + node_to_str(tree, node_id, criterion)
    
    # Recurse left and right children unless current node is a leaf
    if left_child != sklearn.tree._tree.TREE_LEAF:
      json = json + ",\n" + \
        tabs + '  "left": ' + \
        recurse_tree(tree, left_child, criterion=criterion, depth=depth+1) + ",\n" + \
        tabs + '  "right":  ' + \
        recurse_tree(tree, right_child, criterion=criterion, depth=depth+1)

    json = json + tabs + "\n" + \
      tabs + "}"

    return json

  # Only works for sklearn decision tree implementation
  # TODO: tweak to work for own implementation of decision trees
  if isinstance(tree, sklearn.tree.tree.Tree):
    json = json + recurse_tree(tree, 0, criterion="impurity")
  else:
    json = json + recurse_tree(tree.tree_, 0, criterion=tree.criterion)

  return json
