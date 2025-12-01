INSERT INTO about (title, description, image_url) VALUES 
('기업의 ESG 경영을 위한 최적의 사회공헌 파트너, 오픈더쉐어', '오픈더쉐어는 기업의 사회적 책임(CSR)과 ESG 경영 목표 달성을 돕는 전문 파트너입니다. 우리는 단순한 봉사활동을 넘어, 기업의 가치와 사회의 필요를 연결하는 임팩트 있는 사회공헌 프로그램을 기획하고 실행합니다.', 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');

INSERT INTO about_feature (icon, title, description) VALUES 
('💡', '맞춤형 프로그램 기획', '기업의 비전과 미션에 부합하는 독창적인 프로그램을 제안합니다.'),
('🚀', '원스톱 운영 솔루션', '기획부터 실행, 결과 보고까지 모든 과정을 책임지고 운영합니다.'),
('📊', '임팩트 측정 및 보고', '활동의 사회적 가치를 측정하고, ESG 보고에 활용 가능한 데이터를 제공합니다.');

INSERT INTO impact_stat (value, label) VALUES 
('150+', '누적 파트너사'),
('3,000+', '총 참여 임직원'),
('12,000+', '총 봉사 시간'),
('10,000+', '수혜 인원');

INSERT INTO program (title, description, icon) VALUES 
('환경보호', '도심 숲 가꾸기, 해변 정화 활동 등', '🌳'),
('지역사회 기여', '취약계층 주거 개선, 벽화 그리기 등', '🏘️'),
('아동/청소년 지원', '교육 멘토링, 학습 환경 개선 등', '🎓'),
('문화/예술 나눔', '문화 소외계층을 위한 공연, 전시 지원', '🎨');

INSERT INTO process_step (title, description) VALUES 
('컨설팅 및 요구분석', '기업의 ESG 목표와 니즈를 파악하고, 최적의 방향성을 제시합니다.'),
('프로그램 기획 및 제안', '사회적 가치와 임직원 참여를 극대화할 수 있는 맞춤형 프로그램을 설계합니다.'),
('실행 및 운영', '참가자 모집부터 현장 운영까지, 모든 과정을 전문적으로 관리합니다.'),
('결과 보고 및 피드백', '활동 결과를 데이터 기반으로 분석하고, 향후 방향을 함께 논의합니다.');

INSERT INTO portfolio_item (title, category, image_url, partner, period, participants, story) VALUES 
('미래세대육성', 'IT 기업 연합', 'https://images.pexels.com/photos/5428153/pexels-photo-5428153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Tech For Good Alliance', '2023년 10월', 80, '국내 유수 IT 기업들과 협력하여 소외계층 청소년들에게 코딩 교육과 IT 멘토링을 제공하는 프로젝트를 진행했습니다. 참가 학생들은 자신만의 웹사이트를 만들며 미래의 꿈을 키웠고, 참여한 임직원들은 재능 기부를 통해 큰 보람을 느꼈습니다.'),
('우리동네, 함께 가꾸는 벽화 그리기', '건설사', 'https://images.pexels.com/photos/7136655/pexels-photo-7136655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '희망 건설', '2023년 9월', 50, '노후화된 주택가의 낡은 담벼락에 희망을 그리는 벽화 봉사활동을 진행했습니다. 임직원들과 지역 주민들이 함께 참여하여 마을에 활기를 불어넣었고, 아름다운 포토존으로 재탄생했습니다.'),
('어르신들을 위한 따듯한 도시락 나눔', '식품 기업', 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '행복 F&B', '2023년 11월', 40, '거동이 불편한 독거 어르신들에게 임직원들이 직접 만든 영양 가득한 도시락을 전달했습니다. 따뜻한 식사와 함께 안부를 여쭙고 정서적 지지를 제공하며 의미 있는 시간을 보냈습니다.'),
('금융사와 함께하는 도심 숲 가꾸기', '금융 그룹', 'https://images.pexels.com/photos/7943940/pexels-photo-7943940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '그린 파이낸셜', '2023년 5월', 120, '미세먼지 저감과 도시 열섬 현상 완화를 위해 도심 속 공원에 나무를 심고 가꾸는 활동을 진행했습니다. 임직원들이 가족과 함께 참여하여 환경의 소중함을 배우고, 지역사회에 푸른 쉼터를 선물했습니다.');

INSERT INTO testimonial (name, role, quote) VALUES 
('김민준', 'A 기업 ESG팀장', '오픈더쉐어 덕분에 형식적인 봉사활동에서 벗어나, 우리 회사의 비전과 연결되는 의미 있는 프로그램을 진행할 수 있었습니다. 임직원들의 만족도가 매우 높았습니다.'),
('박서연', 'B 기업 사회공헌 담당자', '복잡하고 어려운 사회공헌 활동의 전 과정을 전문가가 알아서 처리해주니 정말 편했습니다. 결과 보고서의 퀄리티도 기대 이상이었습니다.'),
('이진호', 'C 기업 프로그램 참가자', '회사를 통해 이렇게 보람 있는 활동에 참여할 수 있어 좋았습니다. 동료들과 함께 땀 흘리며 나눔의 기쁨을 느낄 수 있었던 소중한 경험이었습니다.');

INSERT INTO partner (name, logo) VALUES 
('Alpha Corp', 'https://placehold.co/150x50/e2e8f0/475569?text=AlphaCorp'),
('Beta Solutions', 'https://placehold.co/150x50/e2e8f0/475569?text=BetaSol'),
('Gamma Tech', 'https://placehold.co/150x50/e2e8f0/475569?text=GammaTech'),
('Delta Group', 'https://placehold.co/150x50/e2e8f0/475569?text=DeltaGroup'),
('Epsilon Inc', 'https://placehold.co/150x50/e2e8f0/475569?text=Epsilon'),
('Zeta Systems', 'https://placehold.co/150x50/e2e8f0/475569?text=ZetaSys');

INSERT INTO faq (question, answer) VALUES 
('프로그램 비용은 어떻게 산정되나요?', '프로그램 비용은 참여 인원, 장소, 내용, 재료비 등에 따라 맞춤형으로 산정됩니다. 자세한 내용은 문의주시면 상세한 견적과 함께 안내해 드립니다.'),
('소규모 인원도 참여가 가능한가요?', '네, 가능합니다. 10명 내외의 소규모 팀부터 100명 이상의 대규모 인원까지, 참여 규모에 맞는 최적의 프로그램을 기획해 드립니다.'),
('지방에서도 프로그램 진행이 가능한가요?', '네, 전국 어디서나 프로그램 진행이 가능합니다. 지역의 특성과 상황을 고려한 맞춤형 프로그램을 기획하여 운영합니다.'),
('ESG 보고서에 활용할 수 있는 결과 데이터를 제공해주나요?', '네, 프로그램 종료 후 활동 내용과 성과, 참여자 만족도 등을 포함한 상세한 결과 보고서를 제공합니다. 해당 데이터는 기업의 ESG 보고서나 지속가능경영보고서에 활용하실 수 있습니다.');
