-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-12-2025 a las 01:50:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectofinal`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `total`, `created_at`) VALUES
(1, 48650.00, '2025-11-27 19:31:56'),
(2, 268752.00, '2025-11-27 19:51:38'),
(3, 48650.00, '2025-11-27 19:54:14'),
(4, 48650.00, '2025-11-27 20:56:46'),
(5, 48650.00, '2025-11-27 20:58:37'),
(6, 48650.00, '2025-11-27 21:03:37'),
(7, 48650.00, '2025-11-27 22:38:16'),
(8, 85050.00, '2025-12-27 22:43:35'),
(9, 55549.00, '2025-11-27 22:45:10'),
(10, 3250.00, '2025-11-27 22:48:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(500) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `en_oferta` tinyint(1) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `product_id`, `nombre`, `descripcion`, `precio`, `imagen`, `categoria`, `en_oferta`, `stock`, `created_at`, `updated_at`) VALUES
(1, 'prod-1', 'Laptop Gamer MSI', 'Core i9, 32GB RAM, SSD 2TB, RTX 4080', 48500.00, 'http://localhost:3000/images/laptop-gamer-msi.png', 'laptops', 0, 2, '2025-11-19 17:03:40', '2025-11-27 23:03:34'),
(2, 'prod-2', 'Monitor Curvo Ultrawide 49\"', 'Panel OLED, 240Hz, 1ms respuesta', 21200.00, 'http://localhost:3000/images/moniutor-curvo-ultW.webp', 'accesorios', 1, 0, '2025-11-19 17:03:40', '2025-11-27 23:06:17'),
(3, 'prod-3', 'Teclado Mecánico RGB', 'Switches ópticos, layout completo', 3100.00, 'http://localhost:3000/images/teclado-mekanico.png', 'accesorios', 0, 22, '2025-11-19 17:03:40', '2025-11-27 23:07:25'),
(4, 'prod-4', 'Desktop Workstation Pro', 'Ryzen 9, 64GB RAM, RTX 4090', 65000.00, 'http://localhost:3000/images/workstation.png', 'desktops', 1, 2, '2025-11-19 17:03:40', '2025-11-27 23:08:42'),
(5, 'prod-5', 'Mouse Gaming Wireless', 'Sensor 25,600 DPI, 8 botones programables', 1800.00, 'http://localhost:3000/images/mouse-gamer.png\r\n', 'accesorios', 0, 27, '2025-11-19 17:03:40', '2025-11-27 23:10:59'),
(6, 'prod-6', 'Auriculares Gaming 7.1', 'Sonido envolvente, micrófono retráctil', 2500.00, 'http://localhost:3000/images/audifonos-gamer.png', 'accesorios', 1, 19, '2025-11-19 17:03:40', '2025-11-27 23:11:52'),
(7, 'prod-7', 'Laptop Macbook Pro', '\r\nLaptop Macbook Pro, 14\", Procesador M3, Ram 36gb, 512gb Ssd, Plata, Macos', 36099.00, 'http://localhost:3000/images/mcbook-pro.png', 'laptops', 0, 1, '2025-11-24 19:01:44', '2025-11-27 23:16:15'),
(8, 'prod-8', 'Laptop Gamer Msi Katana 15', 'Laptop Gamer Msi Katana 15 Hx 15.6\" 165hz Qhd RTX 5070 8gb Core I7 14650hx 16gb 1tb Ssd W11h 1yw ', 30600.00, 'http://localhost:3000/images/laptop-gamer-msi.png', 'laptops', 1, 1, '2025-11-24 19:06:32', '2025-11-24 19:06:32'),
(9, 'prod-9', 'Laptop Gamer Lenovo Loq 15iax9e', 'Laptop Gamer Lenovo Loq 15iax9e, 15.6\", Core I5-12450hx, GeForce RTX 3050, 8gb, 512gb Ssd, Full Hd, Windows 11 Home', 15000.00, 'http://localhost:3000/images/lenovo-gamer.avif', 'laptops', 0, 3, '2025-11-24 19:14:13', '2025-11-27 23:17:48'),
(10, 'prod-10', 'Laptop Lenovo Ideapad 1', 'Laptop Lenovo Ideapad 1 15amn7, 15.6 Pulgadas, Amd Ryzen 3 7320u, 2.40 Ghz, Disco Duro 256gb Ssd, Ram 8gb, Windows 11 Home', 7500.00, 'http://localhost:3000/images/lenovo.avif', 'laptops', 1, 3, '2025-11-24 19:14:13', '2025-11-27 23:18:57'),
(11, 'prod-11', 'Laptop victus gaming', 'hp Laptop victus gaming 15 6\" core i5 8gb 512gb 15 Fa1029nr', 13299.00, 'http://localhost:3000/images/victus.webp', 'laptops', 1, 2, '2025-11-24 19:20:54', '2025-11-27 23:20:07'),
(12, 'prod-12', 'Descansa Muñecas Kensington', 'Descansa Muñecas Kensington de gel 240 X 182 X 25 Mm, 240 Mm, 182 Mm, Negro, Azul', 463.00, 'http://localhost:3000/images/descansa-muñecas.png', 'accesorios', 0, 9, '2025-11-24 19:26:39', '2025-11-27 23:21:18'),
(13, 'prod-13', 'Mousepad Gamer Xzeal', 'Mousepad Gamer Xzeal Xzpemp1b 800 Mm, 300 Mm, Negro', 150.00, 'http://localhost:3000/images/mousepad.webp', 'accesorios', 1, 3, '2025-11-24 19:26:39', '2025-11-27 23:22:43'),
(14, 'prod-14', 'Monitor 3nstar', 'Monitor 3nstar Tcm010vh, Touch Screen, 15 Pulgadas, Resolucion Hd, Resistivo, Hd, Vga, Hdmi Usb', 5999.00, 'http://localhost:3000/images/monitor tactil.png', 'accesorios', 1, 2, '2025-11-25 18:06:31', '2025-11-27 23:25:09'),
(15, 'prod-15', 'Teclado Multimedia Gamer Vorago Cambio', 'Teclado Vorago Kb-503, Retroiluminado Led Rainbow, Anti-ghosting, Usb 2.0, Negro', 350.00, 'http://localhost:3000/images/teclado-vorago.png', 'accesorios', 0, 5, '2025-11-25 18:06:31', '2025-11-27 23:26:11'),
(16, 'prod-16', 'ThinkStation P3 Gen 2', 'Procesador Intel® Core™ Ultra 5 245 vPro® (núcleos E de hasta 4,50 GHz núcleos P de hasta 5,10 GHz), Windows 11 Pro 64,\r\nNVIDIA RTX™ A400 4GB GDDR6', 31200.00, 'http://localhost:3000/images/thinkstation.avif', 'desktops', 0, 1, '2025-11-25 18:10:49', '2025-11-27 23:27:04'),
(17, 'prod-17', 'Workstation ASUS ExpertCenter D900', 'Workstation ASUS ExpertCenter D900, Intel Core Ultra 7 265, 32GB, 1TB SSD, NVIDIA GeForce RTX 3050, Windows 11 Pro', 36239.00, 'http://localhost:3000/images/asus-wrokstation.png', 'desktops', 0, 1, '2025-11-25 18:14:03', '2025-11-27 23:28:05'),
(18, 'prod-18', 'Lenovo LOQ Tower Gen 10', 'Procesador Intel® Core™ Ultra 7 255HX (núcleos E de hasta 4,50 GHz núcleos P de hasta 5,20 GHz), Windows 11 Home idioma único 64, NVIDIA® GeForce RTX™ 3050 6GB GDDR6', 24578.00, 'http://localhost:3000/images/lenovo-tower.avif\r\n', 'desktops', 0, 1, '2025-11-25 18:22:49', '2025-11-27 23:29:02'),
(19, 'prod-19', 'Desktop gaming Asus ROG', 'Desktop gaming Asus ROG G13CHR-51440F080W NVIDIA GeForce RTX 4060 Intel Core I5 14vaDual 8GB 1TB Negro', 22990.00, 'http://localhost:3000/images/desktop asus.png', 'desktops', 1, 2, '2025-11-25 18:22:49', '2025-11-27 23:30:09'),
(20, 'prod-20', 'Dell Vostro 3030', 'Dell Vostro 3030 Tower Computadora de sobremesa, Intel Core i9-12900K, 64 GB de RAM, SSD NVMe de 2 TB, gráficos Intel UHD 770, Wi-Fi, Bluetooth, Windows 11 Pro - AI Copilot, negro', 29684.00, 'http://localhost:3000/images/dell vostro.webp', 'desktops', 1, 1, '2025-11-25 18:27:12', '2025-11-27 23:31:21'),
(21, 'prod-21', 'Mini PC Lanix Titan', 'Mini PC Lanix Titan Mini 6020, Intel Core i9-14900, 32GB, 1TB SSD, Windows 11 Pro', 34399.00, 'http://localhost:3000/images/lanix.png', 'desktops', 1, 2, '2025-11-25 18:30:57', '2025-11-27 23:32:13'),
(22, 'prod-22', 'Laptop Gamer ROG Strix G16', 'ASUS ROG Strix G16 (2025) Laptop para juegos, visualización FHD+ 16:10 de 165 Hz/3 ms, GPU NVIDIA® GeForce RTX™ 5050, procesador Intel® Core™ i7 14650HX, DDR5 de 16 GB, SSD PCIe Gen 4 de 1 TB, Wi-Fi 8', 29826.00, 'http://localhost:3000/images/asus-rogue.png', 'laptops', 1, 1, '2025-11-25 18:36:00', '2025-11-27 23:33:09'),
(23, 'prod-23', 'Dell Laptop Gaming Serie G 5530', 'Dell Laptop Gaming Serie G 5530, NVIDIA GeForce RTX 4050 (6GB), 15.6\" FHD Ci7-13650HX (14Cores), 16GB 512 GB SSD', 24265.00, 'http://localhost:3000/images/laptop-gamer-msi.png', 'laptops', 0, 2, '2025-11-25 18:36:00', '2025-11-27 23:35:48'),
(24, 'prod-24', 'Computadora Gamer Xtreme ', 'Computadora Gamer Xtreme PC Gaming 14900KF, Intel Core i9-14900KF, NVIDIA GeForce RTX 5060, 32GB, 2TB SSD, Wi-Fi, Windows 11 ', 28199.00, 'http://localhost:3000/images/thinkstation.avif', 'desktops', 1, 1, '2025-11-25 18:38:10', '2025-11-27 23:36:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `fecha_suscripcion` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `email`, `fecha_suscripcion`, `activo`) VALUES
(2, 'jaeldantez@gmail.com', '2025-11-20 00:56:22', 1),
(6, 'contrerasjael061@gmail.com', '2025-11-27 20:54:29', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `contrasena` varchar(70) NOT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'usuario',
  `intentosFallidos` int(11) NOT NULL DEFAULT 0,
  `cuentaBloqueada` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `reset_token` varchar(512) DEFAULT NULL,
  `reset_token_expires` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `correo`, `contrasena`, `rol`, `intentosFallidos`, `cuentaBloqueada`, `reset_token`, `reset_token_expires`) VALUES
(1, 'Jael Contreras', 'contrerasjael061@gmail.com', '$2b$10$1OIW3jpvY4ibiVehTgcC4OR3RrDTZMzEDm6GnuBzk.GJuYUbc1LRq', 'admin', 0, '2025-12-01 20:09:41.833148', NULL, NULL),
(2, 'Felipe Lopez', 'felipe@gmail.com', '$2b$10$/Aj/qK5gwBehFxbIBNFeLeCfdJyf6rc6GOog7RAfrPlKJitRVq/Oi', 'usuario', 0, '2025-11-27 22:54:22.790955', NULL, NULL),
(3, 'Jade Rulos', 'jade@gmail.com', '$2b$10$ih2qirbhzTHOMdcA2RzoEOZbNUU.7Lwk31CXZ6qDPVwz9AXqkSRQO', 'usuario', 0, '2025-11-17 20:58:09.155112', NULL, NULL),
(4, 'Arturo Lopez', 'arturo@gmail.com', '$2b$10$L8/a4htc6/yGVRb5cMJd1ey/NCRejAyjW2/3a1hx59sEUN4dLxp4y', 'usuario', 0, '2025-11-17 20:39:19.180151', NULL, NULL),
(5, 'Elias Ayub', 'alias@gmail.com', '$2b$10$jLY/GLMsJsHrfWZAiZ0j4.oEmqZ4mN76ka5gLpYAMQL7oXRioQkr2', 'usuario', 0, '2025-11-17 20:50:10.131485', NULL, NULL),
(6, 'Raul Rico', 'raul.ponce.rico@gmail.com', '$2b$10$KIZfdfGN05MCC/gC35dqJ../FS2zFLYe9nSqSu5WkcSNPsethXSby', 'admin', 0, '2025-11-20 02:54:38.077687', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoicmF1bC5wb25jZS5yaWNvQGdtYWlsLmNvbSIsImlhdCI6MTc2MzU5ODI1MywiZXhwIjoxNzYzNTk5MTUzfQ.2ar4KWR6LTg3abU8G8ftwOzZU9WS5uyD0ND9whVlh24', '2025-11-20 00:39:13.140000'),
(7, 'Pedro Sanchez', 'pedro@gmail.com', '$2b$10$lEyQuumIUz.BlKEH9RtHsec8m2Mi46yGLKFpxfvPoNxYuoDypiyOO', 'usuario', 0, '2025-11-27 19:36:09.616906', NULL, NULL),
(8, 'Juan Alvarez', 'juan@gmail.com', '$2b$10$89E1l8T01VEVJRMJ9x2ZJuVFT8/sJKVQmH0r/7uOIvyXRzQR7L9aa', 'usuario', 0, '2025-11-27 19:41:20.148159', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`);

--
-- Indices de la tabla `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
