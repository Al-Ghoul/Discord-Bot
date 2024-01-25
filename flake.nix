{
  description = "Discord bot dev/build environment.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { nixpkgs, devenv, ... } @ inputs:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells."${system}".default = with pkgs; devenv.lib.mkShell {
        inherit inputs pkgs;

        modules = [
          ({ ... }: {
            packages = [
              nodejs
              yarn
              nodePackages_latest.dotenv-cli
              # For @discordjs/opus
              python3
              gnumake42
              gcc
            ];
            pre-commit.hooks = {
              deadnix.enable = true;
              nixpkgs-fmt.enable = true;
              denofmt.enable = true;
              denolint.enable = true;
            };
          })
        ];

      };

    };
}
