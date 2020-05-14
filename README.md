# dgraph-js-native vs dgraph-js Benchmarks

Legend: `DNF` = Did not Finish

## Mutation / Transaction Benchmark

Test is done by generating nodes with `predsSize` predicates, and pushing in a mutation `nodesPerBatch` nodes at a time, for `batches` times before committing the transaction.

### dgraph-js-native

|batches|nodesPerBatch|predsSize|timeSpent|
|-------|-------------|---------|---------|
|10     |10           |1        |88       |
|10     |10           |10       |189      |
|10     |10           |100      |884      |
|10     |100          |1        |235      |
|10     |100          |10       |590      |
|10     |100          |100      |4507     |
|10     |1000         |1        |1291     |
|10     |1000         |10       |4793     |
|10     |1000         |100      |48270    |
|100    |10           |1        |978      |
|100    |10           |10       |2408     |
|100    |10           |100      |15955    |
|100    |100          |1        |4982     |
|100    |100          |10       |16993    |
|100    |100          |100      |168108   |
|100    |1000         |1        |58212    |
|100    |1000         |10       |208994   |
|100    |1000         |100      |DNF      |

### dgraph-js

|batches|nodesPerBatch|predsSize|timeSpent|
|-------|-------------|---------|---------|
|10     |10           |1        |139      |
|10     |10           |10       |234      |
|10     |10           |100      |1055     |
|10     |100          |1        |275      |
|10     |100          |10       |728      |
|10     |100          |100      |6105     |
|10     |1000         |1        |1614     |
|10     |1000         |10       |6666     |
|10     |1000         |100      |DNF      |
|100    |10           |1        |1392     |
|100    |10           |10       |4093     |
|100    |10           |100      |33062    |
|100    |100          |1        |8108     |
|100    |100          |10       |33128    |
|100    |100          |100      |DNF      |
|100    |1000         |1        |DNF      |
|100    |1000         |10       |DNF      |
|100    |1000         |100      |DNF      |
