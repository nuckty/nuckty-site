#!/usr/bin/python3
"""Adapt the engine-generated static routing without replacing nginx globals."""
from pathlib import Path
import re
import sys

source = Path(sys.argv[1]).read_text()
output = Path(sys.argv[2])
output.mkdir(parents=True, exist_ok=True)
maps = source[source.index('    # Map Accept-Encoding'):source.index('    # Temporary directories')]
body = source[source.index('        # Block direct access'):source.rfind('    }')]
variables = ['compression_dir', 'compression_suffix', 'content_encoding', 'gzip_accepted', 'avif_dir', 'webp_dir', 'flat_html', 'text_basename', 'is_hashed_static', 'expires_time', 'cache_control', 'target_file', 'file_path', 'encoding_header', 'check_file', 'hash']
for name in variables:
    maps = re.sub(r'\$' + name + r'\b', '$nuckty_' + name, maps)
    body = re.sub(r'\$' + name + r'\b', '$nuckty_' + name, body)
    maps = maps.replace('${' + name + '}', '${nuckty_' + name + '}')
    body = body.replace('${' + name + '}', '${nuckty_' + name + '}')
(output / 'nuckty-maps.conf').write_text(maps)
(output / 'nuckty-locations.conf').write_text(body)

