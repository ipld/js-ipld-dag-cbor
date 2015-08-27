#!/bin/sh
hash=$(ipfs add -r -q schemas | tail -n1)
echo "$hash" >> versions
echo "published $hash"
