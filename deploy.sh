case "$1" in
  lib)
      yarn build-lib
      cp README.md dist/ngx-auto-table
      pushd dist/ngx-auto-table && npm publish
      popd
      ;;
  demo)
      yarn deploy-demo
      ;;
  *)
      echo $"Usage: $0 {lib|demo}"
      exit 1
 esac
