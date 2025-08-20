---
title: "왜 금융에서는 부동소수점 오류를 예방해야만 하는가?"
date: "2025-08-20"
tags: ["Java", "Kotlin", "Backend", "Finance", "Floating Point", "Precision", "BigDecimal"]
excerpt: "금융 시스템에서 부동소수점 연산의 위험성과 정확한 계산을 위한 해결 방법을 알아봅니다. Backend 개발자를 위한 실무 가이드입니다."
---

안녕하세요. 오늘은 백엔드 개발자분들이 반드시 알아야 할 중요한 주제, **부동소수점 오류**에 대해 다루어보겠습니다.

특히 금융 시스템을 개발하는 개발자라면, 이 문제를 제대로 이해하고 해결하지 않으면 **심각한 버그**와 **금전적 손실**을 초래할 수 있습니다.

**가상자산 시장에서는 더욱 중요합니다.** 
- 비트코인은 **8자리 소수점**까지 거래 (1 satoshi = 0.00000001 BTC)
- 이더리움은 **wei 단위까지 분할 가능** (1 wei = 0.000000000000000001 ETH)
- **0.00000001 BTC** 같은 극소량 거래도 빈번
- 부동소수점 오류로 인한 **거래 오류**는 즉시 **수백만원 손실**로 이어질 수 있음

본 포스팅에서는 부동소수점의 근본 원리부터 실제 발생할 수 있는 문제들, 그리고 해결 방법까지 심층적으로 다루어 보겠습니다.

## 🚨 **부동소수점 오류가 왜 위험한가?**

### 부동소수점이란 무엇인가?

**부동소수점(Floating Point)** 은 컴퓨터에서 실수를 표현하는 방식입니다. "부동"이라는 말은 소수점의 위치가 고정되지 않고 **떠다닌다**는 의미입니다.

**기본 원리:**
```
123.456 = 1.23456 × 10²
0.00123 = 1.23 × 10⁻³
```

**핵심: 부동소수점은 실제 소수점을 사용하지 않고, 거듭제곱 형태로 표현합니다!**

**10진수 부동소수점:**
```
123.456 = 1.23456 × 10²
0.00123 = 1.23 × 10⁻³
1000000 = 1.0 × 10⁶
```

**2진수 부동소수점 (컴퓨터 내부):**
```
10진수 6.25 = 2진수 110.01 = 1.1001 × 2²
10진수 0.1 = 2진수 0.0001100110011... = 1.1001100110011... × 2⁻⁴
```

**IEEE 754 표준 (가장 일반적):**
- **부호**: 양수/음수 구분
- **지수**: 2의 거듭제곱 (소수점 위치)
- **가수**: 실제 숫자 부분

### 왜 문제가 발생하는가?

**1. 2진수 표현의 한계:**
```
10진수 0.1 = 1/10 = 1/2 × 1/5
2진수로는 무한 반복: 0.0001100110011...
컴퓨터는 유한한 비트로만 저장 → 정확한 값 표현 불가
```

**실제 메모리 구조 (64비트 double):**
```
┌─────────┬─────────┬─────────────────────────┐
│ 부호(1) │ 지수(11)│        가수(52)         │
└─────────┴─────────┴─────────────────────────┘

0.1을 저장할 때:
부호: 0 (양수)
지수: 1019 (2⁻⁴을 나타냄)
가수: 1.1001100110011001100110011001100110011001100110011010
```

**2. 정밀도 손실:**
- 64비트 double: 약 15-17자리 정밀도
- 극소량이나 극대량 계산 시 오차 발생
- 반복 연산 시 오차 누적

### 간단한 예시로 확인해보기

```java
// Java에서 발생하는 부동소수점 오류
public class FloatingPointError {
    public static void main(String[] args) {
        double a = 0.1;
        double b = 0.2;
        double result = a + b;
        
        System.out.println("0.1 + 0.2 = " + result);
        System.out.println("예상 결과: 0.3");
        System.out.println("실제 결과: " + result);
        System.out.println("결과가 0.3인가? " + (result == 0.3));
    }
}
```

**실행 결과:**
```
0.1 + 0.2 = 0.30000000000000004
예상 결과: 0.3
실제 결과: 0.30000000000000004
결과가 0.3인가? false
```

**이게 왜 문제가 될까요?**

**부동소수점 오류의 핵심:**
- 컴퓨터는 2진수로만 계산
- 10진수 0.1을 2진수로 정확히 표현할 수 없음
- 유한한 비트로 무한 소수를 근사값으로 저장
- 연산할 때마다 작은 오차가 발생

**정리:**
- ❌ **실제 소수점을 사용하지 않음**
- ✅ **거듭제곱 형태로 표현: `가수 × 기수^지수`**
- ✅ **10진수: `가수 × 10^지수`**
- ✅ **2진수: `가수 × 2^지수`**

**금융 시스템에서 `0.1 + 0.2 = 0.3`이 `false`라면:**
- **이자 계산 오류**
- **수수료 계산 오류** 
- **잔액 계산 오류**
- **세금 계산 오류**

이런 문제들이 발생할 수 있습니다.

## 💰 **실제 발생할 수 있는 문제들**

### 1. 이자 계산 오류

```java
// 잘못된 이자 계산 (부동소수점 사용)
public class InterestCalculator {
    public double calculateInterest(double principal, double rate, int days) {
        double dailyRate = rate / 365.0;
        double interest = principal * Math.pow(1 + dailyRate, days) - principal;
        return interest;
    }
}

// 테스트
InterestCalculator calc = new InterestCalculator();
double interest = calc.calculateInterest(10000.0, 0.05, 30);

System.out.println("이자: " + interest);
// 예상: 41.09... (정확한 값)
// 실제: 41.09000000000001 (부동소수점 오류)
```

### 2. 수수료 계산 오류

```java
// 잘못된 수수료 계산
public class FeeCalculator {
    public double calculateFee(double amount, double feeRate) {
        double fee = amount * feeRate;
        
        // 반올림 처리
        return Math.round(fee * 100.0) / 100.0;
    }
}

// 테스트
FeeCalculator feeCalc = new FeeCalculator();
double fee1 = feeCalc.calculateFee(100.0, 0.025); // 2.5% 수수료
double fee2 = feeCalc.calculateFee(100.0, 0.025);

System.out.println("수수료1: " + fee1);
System.out.println("수수료2: " + fee2);
System.out.println("두 수수료가 같은가? " + (fee1 == fee2));

// 예상: true
// 실제: false (부동소수점 오류로 인해)
```

### 3. 잔액 계산 오류

```java
// 잘못된 잔액 계산
public class BalanceCalculator {
    private double balance = 1000.0;
    
    public void deposit(double amount) {
        balance += amount;
    }
    
    public void withdraw(double amount) {
        balance -= amount;
    }
    
    public double getBalance() {
        return balance;
    }
}

// 테스트
BalanceCalculator calc = new BalanceCalculator();

// 0.1씩 10번 입금
for (int i = 0; i < 10; i++) {
    calc.deposit(0.1);
}

System.out.println("예상 잔액: " + (1000.0 + 10 * 0.1));
System.out.println("실제 잔액: " + calc.getBalance());
System.out.println("정확한가? " + (calc.getBalance() == 1001.0));

// 예상: 1001.0
// 실제: 1000.9999999999999
// 정확한가? false
```

### 4. 가상자산 거래 오류

```java
// 잘못된 가상자산 거래 계산 (부동소수점 사용)
public class CryptoTrader {
    private double btcBalance = 1.0; // 1 BTC
    
    public void tradeBTC(double amount) {
        // 0.00000001 BTC (1 satoshi) 단위 거래
        if (amount < 0.00000001) {
            throw new IllegalArgumentException("최소 거래 단위 미달");
        }
        
        // 부동소수점 오류로 인해 정확하지 않은 계산
        btcBalance -= amount;
        
        // 거래 후 잔액 확인
        System.out.println("거래 후 BTC 잔액: " + btcBalance);
        System.out.println("예상 잔액: " + (1.0 - amount));
        System.out.println("정확한가? " + (btcBalance == (1.0 - amount)));
    }
}

// 테스트
CryptoTrader trader = new CryptoTrader();
trader.tradeBTC(0.00000001);

// 결과: 부동소수점 오류로 인해 거래 금액이 정확하지 않음
// 실제 거래에서는 수백만원 손실 가능!
```

## ✅ **해결 방법: BigDecimal 사용하기**

### BigDecimal이란 무엇인가?

**BigDecimal**은 Java에서 제공하는 **임의 정밀도 부동소수점 연산**을 지원하는 클래스입니다.

**BigDecimal의 장점:**
- **10진수 기반**: 사람이 생각하는 방식과 동일
- **임의 정밀도**: 필요한 만큼의 소수점 자리수 지원
- **정확한 연산**: 오차 없이 정확한 계산
- **반올림 제어**: 다양한 반올림 방식 지원
- **불변 객체**: 연산 후 새로운 객체 생성

**왜 BigDecimal이 정확한가?**

```java
// double (부동소수점) - IEEE 754 표준
double a = 0.1;
double b = 0.2;
double result = a + b;
// 결과: 0.30000000000000004 (부정확)

// BigDecimal - 10진수 기반 정확한 계산
BigDecimal bigA = new BigDecimal("0.1");
BigDecimal bigB = new BigDecimal("0.2");
BigDecimal bigResult = bigA.add(bigB);
// 결과: 0.3 (정확)
```

## 📊 **IEEE 754 vs BigDecimal 비교**

| 구분 | IEEE 754 (double) | BigDecimal |
|------|-------------------|------------|
| **표현 방식** | 2진수 기반 | 10진수 기반 |
| **정확도** | 제한적 (53비트) | 무제한 |
| **메모리** | 고정 (8 bytes) | 가변 (20-40 bytes) |
| **성능** | 빠름 | 느림 |
| **적합한 용도** | 과학적 계산 | 금융 계산 |

**BigDecimal의 내부 구조:**
```java
// BigDecimal은 두 개의 정수로 구성
// unscaledValue × 10^(-scale)
BigDecimal amount = new BigDecimal("123.45");
// unscaledValue = 12345
// scale = 2
// 실제 값 = 12345 × 10^(-2) = 123.45
```

### Java에서 BigDecimal 사용

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

// 기본 연산
BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
BigDecimal sum = a.add(b);                    // 덧셈
BigDecimal diff = a.subtract(b);              // 뺄셈
BigDecimal product = a.multiply(b);           // 곱셈
BigDecimal quotient = a.divide(b, 10, RoundingMode.HALF_UP); // 나눗셈

// 비교 연산
boolean isGreater = a.compareTo(b) > 0;       // a > b
boolean isEqual = a.compareTo(b) == 0;        // a == b

// 정확한 이자 계산 예시
public BigDecimal calculateInterest(BigDecimal principal, BigDecimal rate, int days) {
    BigDecimal dailyRate = rate.divide(new BigDecimal("365"), 10, RoundingMode.HALF_UP);
    BigDecimal onePlusRate = BigDecimal.ONE.add(dailyRate);
    return principal.multiply(onePlusRate.pow(days)).subtract(principal);
}
```

## 🔧 **실무에서 BigDecimal 사용 시 주의사항**

### 1. 생성자 사용법

```java
// ❌ 잘못된 방법
BigDecimal wrong1 = new BigDecimal(0.1);        // 부동소수점 오류 포함
BigDecimal wrong2 = new BigDecimal(0.1 + 0.2); // 이미 오류가 발생

// ✅ 올바른 방법
BigDecimal correct1 = new BigDecimal("0.1");    // 문자열로 생성
BigDecimal correct2 = new BigDecimal("0.2");    // 문자열로 생성
BigDecimal correct3 = BigDecimal.valueOf(0.1);  // valueOf 사용 (단, 정확하지 않을 수 있음)
```

### 2. 반올림 모드 설정

```java
import java.math.RoundingMode;

public class RoundingExample {
    
    public BigDecimal roundToCurrency(BigDecimal amount) {
        // 통화 단위로 반올림 (소수점 2자리)
        return amount.setScale(2, RoundingMode.HALF_UP);
    }
    
    public BigDecimal roundToPercent(BigDecimal rate) {
        // 퍼센트 단위로 반올림 (소수점 4자리)
        return rate.setScale(4, RoundingMode.HALF_UP);
    }
    
    public BigDecimal roundToInterest(BigDecimal interest) {
        // 이자 단위로 반올림 (소수점 2자리, 항상 올림)
        return interest.setScale(2, RoundingMode.CEILING);
    }
}
```

### 3. 상수 정의

```java
public class FinancialConstants {
    // 자주 사용하는 BigDecimal 상수들
    public static final BigDecimal ZERO = BigDecimal.ZERO;
    public static final BigDecimal ONE = BigDecimal.ONE;
    public static final BigDecimal HUNDRED = new BigDecimal("100");
    public static final BigDecimal THOUSAND = new BigDecimal("1000");
    
    // 이자율 관련
    public static final BigDecimal ANNUAL_DAYS = new BigDecimal("365");
    public static final BigDecimal MONTHLY_DAYS = new BigDecimal("30");
    
    // 수수료 관련
    public static final BigDecimal DEFAULT_FEE_RATE = new BigDecimal("0.025"); // 2.5%
}
```

### 언제 무엇을 사용할까?

**BigDecimal 사용해야 하는 경우:**
- ✅ **금융 계산** (이자, 수수료, 잔액)
- ✅ **세금 계산**
- ✅ **정확한 소수점 연산이 필요한 경우**
- ✅ **법적 요구사항이 있는 경우**

**double 사용해도 되는 경우:**
- ✅ **통계 계산** (근사값으로 충분한 경우)
- ✅ **과학적 계산**
- ✅ **성능이 중요한 경우** (단, 정확도는 포기)

## 🚀 **최적화 팁**

### 1. BigDecimal 객체 재사용

```java
public class OptimizedCalculator {
    // 자주 사용하는 BigDecimal 객체들을 캐시
    private static final BigDecimal[] CACHED_VALUES = {
        BigDecimal.ZERO,
        BigDecimal.ONE,
        new BigDecimal("0.01"),
        new BigDecimal("0.1"),
        new BigDecimal("100"),
        new BigDecimal("365")
    };
    
    public BigDecimal getCachedValue(int index) {
        return CACHED_VALUES[index];
    }
}
```

### 2. 적절한 scale 설정

```java
public class ScaleOptimizer {
    
    // 통화 계산용 (소수점 2자리)
    public BigDecimal roundToCurrency(BigDecimal amount) {
        return amount.setScale(2, RoundingMode.HALF_UP);
    }
    
    // 이자율 계산용 (소수점 6자리)
    public BigDecimal roundToInterestRate(BigDecimal rate) {
        return rate.setScale(6, RoundingMode.HALF_UP);
    }
    
    // 세금 계산용 (소수점 2자리, 항상 올림)
    public BigDecimal roundToTax(BigDecimal amount) {
        return amount.setScale(2, RoundingMode.CEILING);
    }
}
```

## 📋 **결론**

**부동소수점 오류는 금융 시스템에서 치명적입니다.** `0.1 + 0.2 ≠ 0.3` 같은 문제가 이자, 수수료, 잔액 계산 오류를 초래할 수 있습니다.

**BigDecimal을 사용해야 하는 경우:**
- 모든 금융 계산
- 정확한 소수점 연산이 필요한 경우
- 법적 요구사항이 있는 경우

**BigDecimal 사용 시 주의사항:**
- 문자열 생성자 사용 (`new BigDecimal("0.1")`)
- 적절한 scale과 rounding mode 설정
- 상수 객체 재사용으로 성능 최적화

**성능 vs 정확도 트레이드오프:**
- `double`: 빠르지만 부정확
- `BigDecimal`: 느리지만 정확

### 실무 적용 가이드

**Backend 개발자라면:**
- ✅ 금융 관련 API는 반드시 BigDecimal 사용
- ✅ 데이터베이스 스키마도 DECIMAL 타입 사용
- ✅ API 응답에서도 정확한 소수점 자리수 보장
- ✅ 단위 테스트로 정확성 검증

**가상자산 시장에서는 더욱 중요합니다:**
- **극소량 거래**: 1 satoshi (0.00000001 BTC) 단위 거래도 빈번
- **높은 정확도 요구**: BTC는 8자리, ETH는 wei 단위까지 정확한 계산 필요
- **즉시 손실**: 부동소수점 오류로 인한 거래 오류는 즉시 수백만원 손실
- **블록체인 특성**: 한번 실행된 거래는 되돌릴 수 없음

**가상자산 거래 시스템 개발 시 체크리스트:**
- ✅ **BigDecimal 사용** (절대 double 사용 금지)
- ✅ **적절한 scale 설정** (BTC: 8자리, ETH: wei 단위)
- ✅ **최소 거래 단위 검증**
- ✅ **잔액 부족 검증**
- ✅ **단위 테스트로 정확성 검증**

금융 시스템의 핵심은 정확성입니다. 성능보다 정확성이 중요한 분야에서는 반드시 BigDecimal을 사용해야 합니다.

---

## 📊 **참고 자료**

### 공식 문서 및 가이드
- **[Java BigDecimal 공식 문서](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/math/BigDecimal.html)**: Java BigDecimal 클래스 공식 API 문서
- **[IEEE 754 부동소수점 표준](https://ieeexplore.ieee.org/document/4610935)**: IEEE 754 부동소수점 산술 표준
- **[Java 데이터 타입 가이드](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html)**: Oracle 공식 Java 기본 데이터 타입 문서

### 개발자 커뮤니티 자료
- **[Stack Overflow - BigDecimal Best Practices](https://stackoverflow.com/questions/tagged/bigdecimal)**: BigDecimal 관련 질문과 답변
- **[GitHub - BigDecimal Examples](https://github.com/topics/bigdecimal)**: 오픈소스 BigDecimal 사용 예시들
