#!/usr/bin/env bash
# Build a deliverable SCMLab image on the developer machine.
#
# This repo's job ends here. Shipping the image to the VDS is the
# Self-Deploy repo's responsibility (services/scmlab/scripts/release.sh).
#
# Usage:
#   scripts/build.sh <tag>
#   scripts/build.sh v0.1.0
#
# GITHUB_TOKEN and GITHUB_LOGIN are read from .env (or the current
# environment) and passed to the Dockerfile as build-args so that the ISR
# render that runs during `next build` can fetch real GitHub data. Both
# are optional; without them the projects list falls back to
# content/projects-manual.yml.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  printf 'usage: %s <tag>\n' "$0" >&2
  exit 1
fi

TAG="$1"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_REPO="${IMAGE_REPO:-scarletmu-home}"
IMAGE_REF="${IMAGE_REPO}:${TAG}"

cd "${REPO_ROOT}"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  . .env
  set +a
fi

build_args=()
[[ -n "${GITHUB_TOKEN:-}" ]] && build_args+=(--build-arg "GITHUB_TOKEN=${GITHUB_TOKEN}")
[[ -n "${GITHUB_LOGIN:-}" ]] && build_args+=(--build-arg "GITHUB_LOGIN=${GITHUB_LOGIN}")

printf '==> docker build %s\n' "${IMAGE_REF}"
docker build "${build_args[@]}" -t "${IMAGE_REF}" .

printf '==> ready: %s\n' "${IMAGE_REF}"
printf '    next step: cd ../Self-Deploy/services/scmlab && IMAGE_TAG=%s scripts/release.sh\n' "${TAG}"
