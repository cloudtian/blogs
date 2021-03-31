
var arr = [1,0,3,6,2,4,9,8,7,5,20,12,27,18];
console.log('arr', arr.join(' '));
/**
 * 冒泡排序
 * 1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。 
 * 2. 对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。
 * 3. 针对所有的元素重复以上的步骤，除了最后一个。
 * 4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。
 * 
 * 时间复杂度
 * 若初始状态是正序，则扫描一趟即可完成排序，时间复杂度为O(n)
 * 若初始状态是反序，则为最坏情况，时间复杂度为O(n^2)
 * 总的平均复杂度为O(n^2)
 * 
 * 稳定性
 * 冒泡排序是把小的元素往前排或大的元素往后排。比较的是相邻的两个元素，交换也发生在相邻两个元素之间。
 * 所以，如果两个元素相等，是不会交换的。即使两个相等的元素没有相邻，通过两两交换后也不会对这两个元素交换。
 * 所以，相同元素的前后顺序并没有改变，所以冒泡排序是一种稳定的排序算法。
 */
function bubbleSort (arr = []) {
    for(let i = arr.length;i > 0; i--) {
        for(let j = 0;j < i - 1;j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}
console.log('bubbleSort', bubbleSort(Array.from(arr)).join(' '));

/**
 * 冒泡排序的优化
 * 如果在一轮比较中没有交换元素，那么说明此时已经排序完成
 * 通过设置标志位来表示排序完成
 */
function bubbleFlagSort(arr = []) {
    for (let i = arr.length;i > 0; i--) {
        let flag = false;
        for (let j = 0;j < i - 1;j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                flag = true;
            }
        }
        if (!flag) break;
    }
    return arr;
}
console.log('bubbleFlagSort', bubbleFlagSort(Array.from(arr)).join(' '));

/**
 * 快速排序
 * 
 * 步骤原理：
 * 1.从数列中挑出一个元素，称为 "基准"（pivot），通常取数组的第一个数据
 * 2.重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。最终排完一轮后，该基准就处于数列的中间位置。这个称为分区（partition）操作。
 * 3.递归的把小于基准值元素的子数列和大于基准值元素的子数列排序。
 * 
 * 时间复杂度：
 * 一次划分需要算法时间复杂度是O(n)，
 * 理想情况下，每次划分将序列几乎等分，需要经过log2n趟划分便可得到长度为1的子表。整个算法的事件复杂度为Ο(nlog2n)。
 * 最坏状况下，每次划分所得子表一个为空表，一个为原长度-1。这样需要划分n趟，时间复杂度为Ο(n^2)
 * 为了改善最坏情况，可以采用其他方法选取中间数。通常采用“三者值取中”方法。
 * 快速排序平均时间复杂度为Ο(nlog2n)，被认为是目前最好的一种内部排序方法。
 * 
 * 稳定性：
 * 快速排序不是一种稳定的排序算法，也就是说，多个相同的值的相对位置也许会在算法结束时产生变动。
 */
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var flag = arr.splice(0, 1)[0];
    var left = [];
    var right = [];
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (arr[i] > flag) {
            right.push(arr[i]);
        } else {
            left.push(arr[i]);
        }
    }
    return quickSort(left).concat([flag], quickSort(right));
}
console.log('quickSort', quickSort(Array.from(arr)).join(' '));

/**
 * 插入排序
 * 在待排序的元素中，n-1(n>=2)个数已经是排好顺序的，现在将第n个数插入到已排好的序列中，
 * 需要找到合适的位置，使得插入第n个数后这个序列仍是排好序的。
 * 按照此方法对所有元素进行插入，直到整个序列排位有序的过程。
 * 
 * 时间复杂度
 * 最优情况，当待排序数组是有序时，时间复杂度为O(n)
 * 最坏情况，待排序数组是逆序的，时间复杂度为O(n^2)
 * 平均情况运行时间与最坏情况运行时间一样，是输入规模的二次函数。
 * 
 * 稳定性
 * 如果待排序的序列中存在两个或两个以上具有相同关键词的数据，排序后这些数据的相对次序保持不变，即他们的位置保持不变。
 * 关键词相同的数据元素将保持原有位置不变，所以该算法是稳定的。
 */
function insertSort(arr){
    for (let i = 1; i < arr.length; i++) {
        for (let j = i; j > 0;j--) {
            if (arr[j] > arr[j-1]) {
                break;
            }
            [arr[j-1], arr[j]] = [arr[j], arr[j-1]];
        }
    }
    return arr;
}
console.log('insertSort', insertSort(Array.from(arr)).join(' '));

/**
 * 选择排序
 * 在待排序数据元素中选择最小（或最大）的一个元素，存放在序列的起始位置
 * 然后从剩下的未排序元素中寻找最小（大）元素，放在已排序的序列的末尾
 * 以此类推，直到全部待排序的数据元素的个数为零。
 * 
 * 时间复杂度
 * 交换次数O(n)，最好情况是，已经有序，交换0次，最坏情况交换n-1次，逆序交换n/2次。
 * 交换次数比冒泡排序少多了，由于交换所以CPU时间比比较所需的时间多，n值较小时，选择排序比冒泡排序快。
 * 
 * 稳定性
 * 在一趟选择中，如果一个元素比当前元素小，而该小的元素又出现在一个和当前元素相等的元素后面，那么交换后稳定性就被破坏了。
 * 如： [5 8 5 2 9]，第一遍选择第一个5会和2交换，那么原序列中的两个5的相对前后顺序就被破坏力。
 * 所以选择排序是一个不稳定的排序算法。
 */
function selectSort(arr) {
    for(let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        if (i !== min) {
            [arr[i], arr[min]] = [arr[min], arr[i]];
        }
    }
    return arr;
}
console.log('selectSort', selectSort(Array.from(arr)).join(' '));

/**
 * 归并排序
 * 1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列
 * 2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置。
 * 3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置
 * 4. 重复步骤3直到某一指针超出序列尾
 * 5. 将另一序列剩下的所有元素直接复制到合并序列尾
 * 
 * 复杂度
 * 归并排序比较占用内存，但却是一种效率高且稳定的算法。
 * 
 * 
 * 稳定性
 * 归并排序是稳定的排序，即相等的元素的顺序不会改变。
 * 这对要排序数据包含多个信息而要按其中的某一个信息排序，要求其他信息尽量按输入的顺序排列时很重要。
 * 
 */
// 递归实现，优点是描述算法过程思路清晰，缺点是使用递归，mergeSort()函数频繁地自我调用。
// 长度为n的数组最终会调用mergeSort()函数2n-1次。
function merge(left, right){
    let result = [];
    while (left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    return　result.concat(left).concat(right);
}
function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    }
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

console.log('mergeSort', mergeSort(Array.from(arr)).join(' '));

function shellSort(arr) {
    var len = arr.length;
    for (var fraction = Math.floor(len / 2); fraction > 0; fraction = Math.floor(fraction / 2)) {
        for (var i = fraction; i < len; i++) {
            for (var j = i - fraction; j >= 0 && arr[j] > arr[fraction + j]; j -= fraction) {
                var temp = arr[j];
                arr[j] = arr[fraction + j];
                arr[fraction + j] = temp;
            }
        }
    }
    return arr;
}
console.log('shellSort', shellSort(Array.from(arr)).join(' '));