import numpy as np
from collections import Counter
from sklearn.tree import DecisionTreeClassifier

def build_tree(tree, samples, labels):
  n_samples = samples.shape[0]
  random_indices = np.random.choice(n_samples, n_samples, replace=True)

  tree.fit(samples[random_indices,:], labels[random_indices])
  tree.indices = random_indices

  return tree

def mode(col):
  common = Counter(col)
  return common.most_common(1)[0][0]

# Subclass SKLearn DecisionTreeClassifier to allow storing of indices
# of samples
class RFVDecisionTreeClassifier(DecisionTreeClassifier):
  def __init__(self):

    super(RFVDecisionTreeClassifier, self).__init__()
    self.sample_indices = None


class RandomForestClassifier(object):
  def __init__(self, n_trees):
    self.n_trees = n_trees
    self.trees = None
    self.oob_score = None

  def fit(self, samples, labels):

    samples = np.asarray(samples)
    labels = np.asarray(labels)

    # Initialize all trees
    self.trees = []
    for i in range(self.n_trees):
      tree = RFVDecisionTreeClassifier()
      self.trees.append(tree)

    self.trees = [build_tree(t, samples, labels) for t in self.trees]

    # Acting weird. Need to fix
    self.get_oob_score(samples, labels)

    return self

  def predict(self, samples):

    predictions = [t.predict(samples) for t in self.trees]

    predictions = np.asarray(predictions)

    pred_labels = self._predict(predictions)

    return pred_labels

  # Votes for majority class
  def _predict(self, predictions):

    voted_preds = np.apply_along_axis(mode, 0, predictions)

    return voted_preds

  # TODO: Not the right values, need to fix
  def get_oob_score(self, samples, labels):
    n_outputs = labels.shape[0]

    predictions = np.zeros((self.n_trees, n_outputs))

    all_sample_indices = np.array(range(samples.shape[0]))

    for i in range(self.n_trees):
      mask = np.ones(len(all_sample_indices), dtype=bool)
      mask[self.trees[i].indices] = False
      left_out_indices = all_sample_indices[mask]
      
      predictions[i, left_out_indices] = self.trees[i].predict(samples[left_out_indices,:])

    prediction_mask = np.all(np.equal(predictions, 0), axis=0)
    predictions[:,~prediction_mask]

    pred_labels = predictions.astype(float).sum(axis=0) / (predictions != 0).sum(axis=0)

    # posteriors = predictions.astype(float).sum(axis=0) / (predictions != 0).sum(axis=0)

    # pred_labels = [1 if posterior > .5 else 0 for posterior in posteriors]

    oob_score = 0.0
    for pred, actual in zip(pred_labels, labels):
      oob_score += (1 if (pred - actual != 0) else 0)

    self.oob_score = 1.0 - (oob_score / n_outputs)

    return self.oob_score

  def score(self, samples, labels):

    predicted_labels = self.predict(samples)

    difference = 0.0
    for pred, actual in zip(predicted_labels, labels):
      difference += (1 if (pred - actual != 0) else 0)

    return 1.0 - (difference / len(predicted_labels))




