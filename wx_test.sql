-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Окт 07 2022 г., 05:45
-- Версия сервера: 10.4.18-MariaDB
-- Версия PHP: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `wx_test`
--

-- --------------------------------------------------------

--
-- Структура таблицы `road_signs`
--

CREATE TABLE `road_signs` (
  `id` int(10) UNSIGNED NOT NULL,
  `the_date` date NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` smallint(5) UNSIGNED NOT NULL,
  `distance` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `road_signs`
--

INSERT INTO `road_signs` (`id`, `the_date`, `name`, `amount`, `distance`) VALUES
(1, '2021-10-02', 'Крутой спуск', 5, 23),
(2, '2021-10-02', 'Крутой подьём', 3, 11),
(3, '2021-10-03', 'Скользкая дорога', 6, 20),
(4, '2022-09-04', 'Неровная дорога', 2, 3),
(5, '2022-09-05', 'Выброс гравия', 1, 2),
(6, '2022-09-06', 'Опасная обочина', 2, 5),
(7, '2022-10-07', 'Обгон запрещен', 10, 34),
(8, '2022-10-08', 'Дорожные работы', 1, 2),
(9, '2022-10-09', 'Дикие животные', 2, 10),
(10, '2022-10-10', 'Тоннель', 1, 1),
(11, '2022-10-11', 'Боковой ветер', 4, 16),
(12, '2022-10-12', 'Опасные повороты', 2, 5),
(13, '2022-10-13', 'Перегон скота', 2, 1),
(14, '2022-10-14', 'Ограничение максимальной скорости', 5, 20),
(15, '2022-10-15', 'Остановка запрещена', 3, 3),
(16, '2022-10-16', 'Падение камней', 1, 1),
(17, '2022-10-17', 'Прочие опасности', 2, 4),
(18, '2022-10-18', 'Направление поворота', 18, 3),
(19, '2022-10-19', 'Обгон грузовым автомобилям запрещен', 3, 9),
(20, '2022-10-20', 'Стоянка запрещена', 6, 3),
(21, '2022-10-21', 'Затор', 1, 3);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `road_signs`
--
ALTER TABLE `road_signs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `road_signs`
--
ALTER TABLE `road_signs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
