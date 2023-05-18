# Deep Cluster

[Updated on 2023-05-01]

## Intro

Due to the difficult around obtaining good labelled data, self-supervised learning has been increasing in popularity over the last five year. Yann LeCun is a major proponente and his team at Meta AI are constantly publishing papers on the topic. 

Their recent “Cook Book of Self-Supervised Learning” [arXiv:2304.12210] divides the field into three approaches: self-distillation, constrastive and canonical correlation analysis. Of the three I think that self-distillation is the most surprising and challenges some fundemental intuitions about what works when training these models. They are based on the experimental observation that a linear classifier trainined on the features extracted from a random initalised AlexNet encoder obtains 14% top-1 accuracy on ImageNet, where random guessing is 0.1%.  In this blog post I look at one of the early approaches to self-distillation - ‘Deep Cluster’. 

## DeepCluster

Self-distillation models use their own output to generate labels which the model will be retrained on, then the process repeats. Deep Cluster uses an AlexNet encoder as a feature extractor,  and applies kmeans to the extracted features to obtain labels. 

Collapse is a key issue in self-supervised learning. Collapse occurs when the network learns a trival representation to solve the learning task. For example Deep Cluster could collapse by the network learning to output a single embeddding, regardless of input. This would result in each instance being grouped into the same cluster, and then the network can achieve perfect accuracy by predicting that cluster. However a constant embedding isn’t very useful, so the authors have found two mechanisms to prevent collapse. 

The first mechanism to prevent collapse is to encourage equiparition. Equipartion means that the same number of isntances are grouped into each cluster. To implement this; any cluster that has  no instances in it will update it’s centroid to a random other centroid with a small peturbation. This causes it to take about half the other clusters instances.

The second mechanism to prevent collapse is to weight the loss contribution of an instance inversely to the size of the cluster. This means large clusters will have less importance per instance, whereas small clusters will have more important instances. 

## Implementation notes

I use the FAISS implementation of PCA and kmeans. PCA is applied to the embeddings to reduce them from 9216 to 256. This makes the code more memory efficient. 

The paper uses whitening but this is too expensive for me to use. I substract the mean, divide by the variance and divide by the L2 norm. 

Clustering is really slow, it requires a full pass on the dataset.