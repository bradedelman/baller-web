BUILD=$PWD/build
mkdir -p $BUILD

tsc --target es5 --module es2015 --moduleResolution node --lib dom,es2016,es5 --module amd --out $BUILD/Baller.js common/Baller.ts
tsc --target es5 --module es2015 --moduleResolution node --lib dom,es2016,es5 --module amd --out $BUILD/Native.js web/platform/Native.ts

cat $BUILD/Baller.js web/BallerView.js $BUILD/Native.js > ballerWeb.js
