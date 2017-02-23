/**
 * Finds all the alt skills and fills it into data object.
 * Returns the found skill ids.
 *
 * @param connection the jdbc connection
 * @param job the job object
 * @param data the skill tree data object
 * @param altSkillIds the list of alternative skill ids
 * @returns []
 */
function fillAltSkills(connection, job, data, altSkillIds) {
  print("Filling alt skills for ${job.ascendancies[2].slug}");

  const altSkillIdsStr = altSkillIds.join(',');
  const query = sqls['get-alt-skills.prepared.sql'].replace('(?)', "(${altSkillIdsStr})");
  const pstmt = connection.prepareStatement(query);

  pstmt.setInt(1, job.ascendancies[0].id);
  pstmt.setInt(2, job.ascendancies[1].id);
  pstmt.setInt(3, job.ascendancies[2].id);

  const rs = pstmt.executeQuery();
  const skillIds = [];

  while (rs.next()) {
    const skill = mapSkill(rs);

    data.messages.push(skill.name);
    data.skills[skill.id] = skill;

    skillIds.push(skill.id);
  }

  pstmt.close();

  return skillIds;
}