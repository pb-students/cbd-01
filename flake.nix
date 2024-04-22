# flake.nix

{
  description = "Flake with nodejs, pnpm, sqlite";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            corepack
            sqlite
          ];
        };
      in {
        devShell = devShell;
      }
    );
}
