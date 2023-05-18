# Cutting-plane methods. 

Cutting plane methods are a useful tool for solving optimization problems. In particular they solve non-differentiable convex problems. The general problem they solve is finding any point in a set $X \in \mathbb{R}^n $. 
The cutting-plane method is essentially a generilisatoin of bisectoin in $\mathbb{R}$. 

The simplest example is the following:

1. Constraints = $P_k =\{\}$
2. Pick a point $x^{(k)} \in \mathbb{R}^n, x^{(k)} \in P_k$
3. If $x^{(k)} \in X$ then stop. 
4. Calculate a subgradient $g$ at $x$
5. Add the inequality $g^{(k)T} z \leq x^{(k)})$ to the set of constraints.
6. goto 2.

'Exentsion' impolies there's a base method. BUt there's no base method. These are just method of choosing the next point. Possible i would consider the ellipsoid method an extension. 
Four extensions of this method are:
- Center of gravity cutting-plane method
- Chebyshev center cutting-plane method
- Maximum volume ellpsoid method 
- Analytic Cutting plane Method 
- Ellipsoid method

The extensions all seek to find a better point $x^{(k)}$ than a random selection. We basically want the cutting plane to reduce the search space as much as possible. Therefore the center of the polyhedron is a good choice. 


## Center of Gravity Cutting-plane Method

This algorithm is so ineffient that it's considered a theoretical approach. It does highlight exactly what these extensions are trying to do. 

It picks the next search point as the center of gravity of the polyhedron.
$$


x ^ {(k+1)} = \dfrac{\int_{P_k}xdx}{\int_{P_k}dx}

$$

## Chebyshev Center Cutting-plane Method

This method picks the next search point as the center of the largest ball that fits inside the polyhedron. This can be founded via an LP. It a common problem called Chebshev centeing. 

$$
\begin{aligned}
\max \quad & R  \\
\textrm{s.t.} \quad & a_i^T x + R ||a_i||_* \leq b_i, i = 1,...,m \\
\quad & R \geq 0 \\
\end{aligned}
$$


## Maximum volume ellipsoid method 

This is similar to the chebyshev method in that it finds the largest ellipsoid which fits in the polyhedra and then takes the center point of that 

## Analytic Cutting Plane Method

The basic idea here is to find the 'analytic center' of the polyhedron. This optimises a log barrier funciton which can be computed using the infeasible start newton method. 

## Ellipsoid Method



 



## Intersting subproblems: 
- Volume of an ellipsoid
- Minimum cover ellipsoid of polyhedron
- Center of gravity 
- Maximum volume ellipsoid inside polyhedron
- Largest ball in polyhedra 



# Questions?
Center of ellipsoid? Well center of ball is 