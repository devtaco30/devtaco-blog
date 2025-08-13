---
title: "Kotlin Coroutines 완벽 가이드"
date: "2025-08-12"
tags: ["Kotlin", "Coroutines", "Async", "Concurrency"]
excerpt: "Kotlin Coroutines를 사용하여 비동기 프로그래밍을 마스터해보세요."
---

# Kotlin Coroutines 완벽 가이드

안녕하세요! 오늘은 Kotlin Coroutines에 대해 자세히 알아보겠습니다.

## Coroutines란?

Coroutines는 비동기 프로그래밍을 위한 Kotlin의 강력한 기능입니다. 콜백 지옥 없이 비동기 코드를 동기 코드처럼 작성할 수 있습니다.

### 기본 개념
- **Suspend Function**: 일시 중단 가능한 함수
- **Coroutine Scope**: 코루틴의 생명주기 관리
- **Dispatcher**: 코루틴이 실행될 스레드 결정

## 기본 사용법

### 1. Suspend Function
```kotlin
suspend fun fetchUserData(userId: String): User {
    delay(1000) // 1초 대기
    return User(id = userId, name = "DevTaco")
}
```

### 2. Coroutine Scope
```kotlin
fun main() = runBlocking {
    println("코루틴 시작")
    
    launch {
        delay(1000)
        println("1초 후 실행")
    }
    
    println("코루틴 종료")
}
```

### 3. Async/Await
```kotlin
suspend fun fetchUserAndPosts(userId: String): UserWithPosts {
    val userDeferred = async { fetchUser(userId) }
    val postsDeferred = async { fetchPosts(userId) }
    
    val user = userDeferred.await()
    val posts = postsDeferred.await()
    
    return UserWithPosts(user, posts)
}
```

## Spring Boot에서 Coroutines 사용

### Controller
```kotlin
@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {
    
    @GetMapping("/{id}")
    suspend fun getUser(@PathVariable id: String): ResponseEntity<User> {
        val user = userService.findById(id)
        return ResponseEntity.ok(user)
    }
}
```

### Service
```kotlin
@Service
class UserService(private val userRepository: UserRepository) {
    
    suspend fun findById(id: String): User {
        return withContext(Dispatchers.IO) {
            userRepository.findById(id) ?: throw UserNotFoundException(id)
        }
    }
}
```

## 에러 처리

### Try-Catch
```kotlin
suspend fun safeApiCall(): Result<Data> {
    return try {
        val data = apiService.getData()
        Result.success(data)
    } catch (e: Exception) {
        Result.failure(e)
    }
}
```

### CoroutineExceptionHandler
```kotlin
val exceptionHandler = CoroutineExceptionHandler { _, exception ->
    println("코루틴 에러: ${exception.message}")
}

launch(exceptionHandler) {
    throw RuntimeException("테스트 에러")
}
```

## 마무리

Kotlin Coroutines는 비동기 프로그래밍을 훨씬 쉽고 안전하게 만들어줍니다. Spring Boot와 함께 사용하면 고성능 웹 애플리케이션을 구축할 수 있습니다.

다음 포스트에서는 **Flow**에 대해 자세히 다루어보겠습니다!
