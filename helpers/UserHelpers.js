class UserHelpers {
    createUserWithoutPassword(userToCreate) {
        return {
            avatar: userToCreate.avatar,
            dateOfBirthday: userToCreate.dateOfBirthday,
            email: userToCreate.email,
            firstName: userToCreate.firstName,
            gender: userToCreate.gender,
            id: userToCreate.id,
            languages: userToCreate.languages,
            lastName: userToCreate.lastName,
            location: userToCreate.location,
            nickName: userToCreate.nickName,
            number: userToCreate.number,
            status: userToCreate.status,
        };
    }
}

module.exports = new UserHelpers();
