using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class ModifyUserAddressRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAddresses_Addresses_AddressId",
                table: "UserAddresses");

            migrationBuilder.DropIndex(
                name: "IX_UserAddresses_AddressId",
                table: "UserAddresses");

            migrationBuilder.DropIndex(
                name: "IX_UserAddresses_UserId",
                table: "UserAddresses");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "UserAddresses");

            migrationBuilder.RenameColumn(
                name: "AddressId",
                table: "UserAddresses",
                newName: "DefaultAddressId");

            migrationBuilder.AddColumn<int>(
                name: "UserAddressId",
                table: "Addresses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_UserId",
                table: "UserAddresses",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_UserAddressId",
                table: "Addresses",
                column: "UserAddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_UserAddresses_UserAddressId",
                table: "Addresses",
                column: "UserAddressId",
                principalTable: "UserAddresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_UserAddresses_UserAddressId",
                table: "Addresses");

            migrationBuilder.DropIndex(
                name: "IX_UserAddresses_UserId",
                table: "UserAddresses");

            migrationBuilder.DropIndex(
                name: "IX_Addresses_UserAddressId",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "UserAddressId",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "DefaultAddressId",
                table: "UserAddresses",
                newName: "AddressId");

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "UserAddresses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_AddressId",
                table: "UserAddresses",
                column: "AddressId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAddresses_UserId",
                table: "UserAddresses",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAddresses_Addresses_AddressId",
                table: "UserAddresses",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
