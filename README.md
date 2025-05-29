# Pokemon Box Manager

[English](#english) | [中文](#中文)

---

## English

A Pokemon collection management system built with the MERN stack, allowing users to organize and manage Pokemon in virtual boxes.

### Project Overview

Pokemon Box Manager is a full-stack web application that provides an intuitive interface for managing Pokemon collections. Users can move Pokemon between different boxes, view Pokemon details and shiny status, recreating the PC box system experience from Pokemon games.

### Technology Stack

#### Backend

- **Framework**: Express.js + Node.js
- **Database**: MongoDB + Mongoose ODM
- **API Design**: RESTful API supporting box retrieval and Pokemon swapping operations
- **Data Models**: Pokemon model (dex number, name, image URLs, shiny status) and Box model (box number, Pokemon list)

#### Frontend

- **Framework**: React 18 + Vite
- **Routing**: React Router for page navigation
- **State Management**: Custom Hooks for data fetching and state updates
- **UI Design**: CSS Grid layout for Pokemon boxes, responsive design

### Core Features

- Multi-box Pokemon display and navigation
- Drag-and-drop or click-based Pokemon position swapping
- Cross-box Pokemon movement support
- Real-time data synchronization and error handling
- Special indicators for shiny Pokemon

### Project Structure

```
├── backend/          # Express server and API
├── frontend/         # React user interface
├── spec/            # Project specifications and tests
└── README.md        # Project documentation
```

This project demonstrates modern web development best practices, including frontend-backend separation, RESTful API design, component-based development, and database modeling.

---

## 中文

一个基于MERN技术栈的Pokemon管理系统，允许用户在虚拟盒子中组织和管理Pokemon收藏。

### 项目简介

Pokemon Box Manager是一个全栈Web应用，提供直观的界面来管理Pokemon收藏。用户可以在不同的盒子间移动Pokemon，查看Pokemon的基本信息和闪光状态，实现类似于游戏中PC盒子系统的功能体验。

### 技术架构

#### 后端 (Backend)

- **框架**: Express.js + Node.js
- **数据库**: MongoDB + Mongoose ODM
- **API设计**: RESTful API，支持获取盒子信息和Pokemon交换操作
- **数据模型**: Pokemon模型（编号、名称、图片URL、闪光状态）和Box模型（盒子编号、Pokemon列表）

#### 前端 (Frontend)

- **框架**: React 18 + Vite
- **路由**: React Router进行页面导航
- **状态管理**: 自定义Hooks管理数据获取和状态更新
- **UI设计**: CSS Grid布局展示Pokemon盒子，响应式设计适配不同屏幕

### 核心功能

- 多盒子Pokemon展示与导航
- 拖拽或点击方式交换Pokemon位置
- 支持跨盒子Pokemon移动
- 实时数据同步和错误处理
- 闪光Pokemon特殊标识显示

### 项目结构

```
├── backend/          # Express服务器和API
├── frontend/         # React用户界面  
├── spec/            # 项目规范和测试文件
└── README.md        # 项目文档
```

该项目展示了现代Web开发的最佳实践，包括前后端分离、RESTful API设计、组件化开发和数据库建模等核心概念。
