const adjList = makeAdjList();
let pathMatrix;

console.log('By default knight moves from [0,0] to [7,7]\n');
knightMoves();

//  provide two arrays with [X,Y] positions to get the knight's path to his destination
function knightMoves(
    startXY = [0, 0],
    endXY = [adjList.length - 1, adjList.length - 1]
) {
    const [endX, endY] = endXY;
    const movesQueue = [startXY]; //  stores [X,Y] of a next square to check
    const prevSquareQueue = [[null, null]]; //  for starting square prevX/Y is null
    pathMatrix = initPathMatrix();

    let currentX, currentY, prevSquareX, prevSquareY;
    //  try to visit available squares while end position is NOT visited and our queue is not empty
    while (movesQueue && pathMatrix[endX][endY].pathLength === null) {
        [currentX, currentY] = movesQueue.shift();
        [prevSquareX, prevSquareY] = prevSquareQueue.shift();

        //  if current square is already visited - skip
        if (pathMatrix[currentX][currentY].pathLength !== null) continue;
        else {
            /*  mark as visited by setting length. If it's a start (prevX/Y = null) set length to zero.
                PrevX/Y remains null.    */
            if (prevSquareX === null)
                pathMatrix[currentX][currentY].pathLength = 0;
            //  otherwise - length is based on previous square. Record prevX/Y in pathMatrix
            else {
                pathMatrix[currentX][currentY].pathLength =
                    pathMatrix[prevSquareX][prevSquareY].pathLength + 1;
                pathMatrix[currentX][currentY].prevX = prevSquareX;
                pathMatrix[currentX][currentY].prevY = prevSquareY;
            }

            adjList[currentX][currentY].forEach((adjVertex) => {
                movesQueue.push([adjVertex.x, adjVertex.y]);
                prevSquareQueue.push([currentX, currentY]);
            });
        }
    }

    const pathArr = recoverPath(endX, endY);
    pathLogger(pathArr);
}

function recoverPath(endX, endY) {
    //  base case - current square is our start (length 0)
    if (pathMatrix[endX][endY].pathLength === 0) return [[endX, endY]];
    else {
        let tempArr = recoverPath(
            pathMatrix[endX][endY].prevX,
            pathMatrix[endX][endY].prevY
        );
        tempArr.push([endX, endY]);
        return tempArr;
    }
}

function pathLogger(pathArr) {
    if (pathArr.length === 1) {
        console.log(
            'No moves required! Our knight is in position and awaiting your orders!\n',
            pathArr[0].toString()
        );
    } else {
        console.log(`You made it in ${pathArr.length - 1} moves:`);
        pathArr.forEach((XYpair) => {
            console.log('\n', XYpair.toString());
        });
    }
}

/*  Make matrix to hold info about visited squares.
    We store previous visited square (X and Y) and number of edges to starting pos   */
function initPathMatrix(size = 8) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) arr[i] = new Array(size);

    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            arr[i][j] = { prevX: null, prevY: null, pathLength: null };
    return arr;
}

/*  Make adjacency list for knight on a board of set size. Default size is 8 */
function makeAdjList(size = 8) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) arr[i] = new Array(size);

    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++) {
            arr[i][j] = [];
            //  try to move in all directions. If able - write the x/y vertex in adj.list
            //  check up and right
            if (i + 2 >= 0 && i + 2 < size && j + 1 >= 0 && j + 1 < size)
                arr[i][j].push({ x: i + 2, y: j + 1 });
            if (i + 1 >= 0 && i + 1 < size && j + 2 >= 0 && j + 2 < size)
                arr[i][j].push({ x: i + 1, y: j + 2 });

            //  check down and right
            if (i + 2 >= 0 && i + 2 < size && j - 1 >= 0 && j - 1 < size)
                arr[i][j].push({ x: i + 2, y: j - 1 });
            if (i + 1 >= 0 && i + 1 < size && j - 2 >= 0 && j - 2 < size)
                arr[i][j].push({ x: i + 1, y: j - 2 });

            //  check down and left
            if (i - 2 >= 0 && i - 2 < size && j - 1 >= 0 && j - 1 < size)
                arr[i][j].push({ x: i - 2, y: j - 1 });
            if (i - 1 >= 0 && i - 1 < size && j - 2 >= 0 && j - 2 < size)
                arr[i][j].push({ x: i - 1, y: j - 2 });

            //  check up and left
            if (i - 2 >= 0 && i - 2 < size && j + 1 >= 0 && j + 1 < size)
                arr[i][j].push({ x: i - 2, y: j + 1 });
            if (i - 1 >= 0 && i - 1 < size && j + 2 >= 0 && j + 2 < size)
                arr[i][j].push({ x: i - 1, y: j + 2 });
        }
    return arr;
}
