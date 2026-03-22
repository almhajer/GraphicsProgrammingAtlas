#!/usr/bin/env sh
set -eu

mkdir -p dist/package-demo/data
g++ -std=c++17 src/main.cpp -o dist/package-demo/package_demo
cp data/app.cfg dist/package-demo/data/app.cfg
cp data/banner.txt dist/package-demo/data/banner.txt

printf 'تم إنشاء package داخل dist/package-demo\n'
