# Static hosting

The CI workflow builds and tests both languages, saves immutable output artifacts, then deploys main over SSH. Pull requests build and test without deployment credentials. No npm publication is required: CI uses exact source commit SHAs for the core and extensions.

The VM receives only ru/ and en/ output trees. Separate site/demo users have no sudo; each key is restricted to receive.py for its project. The receiver checks all manifest sizes/hashes, rejects unsafe archives, switches both languages through one current symlink, checks both homepages and restores the previous release on failure. Five releases are retained; stale CI runs cannot replace newer deployments.

The administrator installs receive.py as /usr/local/libexec/nuckty-deploy.py and creates /srv/nuckty/{site,demo}/releases owned by their deploy users. The engine-generated nginx maps and locations are adapted by render-nginx.py; they are included in separate virtual hosts on the second interface, preserving the existing proxy listeners. TLS uses certbot webroot and renewal reload. Deployment itself needs no nginx reload or VM restart.

GitHub Secrets: NUCKTY_DEPLOY_KEY. Repository variables: NUCKTY_DEPLOY_HOST, NUCKTY_DEPLOY_USER, NUCKTY_KNOWN_HOSTS, plus the pinned source variables. Never commit private keys. Contact: vitaly@harisov.name.

Run python3 -m unittest discover -s deploy -p 'test_*.py' before changing the receiver. The production setup uses domains nuckty.ru/nuckty.com and demo.nuckty.ru/demo.nuckty.com.

The second IP uses SNI routing: the four nuckty domains go to the internal HTTPS listener 127.0.0.1:8445; all other names retain the existing Reality backend. The replaced 443-to-9000 nftables redirect is removed, while other firewall rules remain in place.

