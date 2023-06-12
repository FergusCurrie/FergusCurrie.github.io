# LLM Training Tricks

Majority of LLM are decoder only with a few tricks for:

- Data Tricks
- Architechture Tricks
- Optimisation tricks
- Engineering tricks

## Architechture Tricks

- LayerNorm after embedding layer
- ALiBI posiition embedding
- RoPe position embedding
- Lazy softmax [ref: self-attention does not need O(n^2 memory)]
- efficient causal multihead attention (calculate (1/2)n^2 dot products)
- prenorm
- residual connections
- swiGLU

## Optimisation Tricks

- AdamW
- Cosine schedule
- weight decay
- gradient clipping
- dropout
- optmising backprop to tradeoff between memory and speed. (save more than normal for expensive operations like Wx)
-

## Engineering tricks

### Mixed precision training

Use low precision where possible.
fp32, great for accuracy, demanding memory. good for softmax
fp16, less accurate, fast less accurate
bfp16

### Efficinet cuda 'stuff'

FlashAttention
