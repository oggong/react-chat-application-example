// 사용자 관련된 모든 것 정의

const users = [];

const addUser = ({ id, name, room }) => {
  // JavaScript Mastery = javascriptmastery

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // existing user
  // 새로운 가입자가 기존 가입자와 같은방의 같은이름으로 가입 하지 못하게 함
  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "Username is taken" };
  }

  const user = { id, name, room };

  users.push(user); // users에 push

  return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id); // 지정 아이디 찾기

  if(index !== -1) return users.splice(index, 1)[0]; // 사용자에서 제거 하고, 0으로 반환
 
};

const getUser = (id) => users.find((user) => user.id === id);

const getUserInRoom = room => {
  users.filter(user => user.room === room);
};
// 그방에 있는 모든 사용자를 불러오기

module.exports = { addUser, removeUser, getUser, getUserInRoom };
