//package org.project.advices;
//
//
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.ProceedingJoinPoint;
//import org.aspectj.lang.annotation.Around;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.project.entities.User;
//import org.springframework.stereotype.Component;
//
//@Aspect
//@Component
//public class Advice {
//
//    @Around("execution(* org.project.controllers.UserController.*(..))")
//    public Object validateUserObj(ProceedingJoinPoint joinPoint) throws Throwable {
//        Object[] args = joinPoint.getArgs();
//
//        if (args.length > 0 && args[0] instanceof User) {
//            User user = (User) args[0];
//            System.out.println("🔹 Original User: " + user);
//
//            // Modify user object
//            user.setUserid(null);
//            user.setForms(null);
//
//            System.out.println("✅ User obj updated to match params");
//        }
//
//        // Proceed with the modified user object
//        return joinPoint.proceed(args);
//    }
//}
