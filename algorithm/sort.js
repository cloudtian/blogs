
/**
 * 冒泡排序
 * 1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。 
 * 2. 对每一对相邻元素做同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。
 * 3. 针对所有的元素重复以上的步骤，除了最后一个。
 * 4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。
 */
function bubbleSort (arr = []) {
    let i = arr.length;
    while (i > 0) {
        for(let j = 0;j < i - 1;j++) {
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
        i++
    }
    return arr;
}

/**
 * 快速排序
 * 在平均状况下，排序 n 个项目要Ο(n log n)次比较。在最坏状况下则需要Ο(n2)次比较
 * 步骤：
 * 1.从数列中挑出一个元素，称为 "基准"（pivot）
 * 2.重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。
 * 3.递归的把小于基准值元素的子数列和大于基准值元素的子数列排序。
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