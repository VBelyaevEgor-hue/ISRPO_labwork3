int TestFunc1 (int num1, int num2) {
    if (num1 > num2) {
        return num1 - num2;
    } else {
        return num2 - num1;
    }
}

int TestFunc2 (int num1, int num2) {
    int count = 0;
    for (int i =0; i < num1; i++) {
        for (int j = 0; j < num2; j++) {
            for (int k = 0; k < 10; k++) {
                if (k % 2 == 0) {
                    count++;
                } else {
                    if (k % 3 == 0) {
                        count += 2;
                    } else {
                        count--;
                    }
                }
            }
        }
    }
    return count;
}


void TestFunc3 (int num1, int num2) {
    if ((num1 > num2) || (num1 == num2) || (num1 < num2) || (num1 > 10) || (num2 > 10)) {
        return;
    }
}